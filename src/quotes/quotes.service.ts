import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isPointInPolygon, isPointWithinRadius } from 'geolib';
import { ObjectId } from 'mongodb';
import { database_connection } from '../db';
import { RegionsService } from '../regions/regions.service';

@Injectable()
export class QuotesService {

    constructor(private regionService: RegionsService) { }



    async getRecent5Requests(query: any): Promise<any | undefined> {
        try {
            let sortObj : any = {requestTime : -1}
            if (query?.maxBudget === "true"){
                sortObj.maxBudgetRange = 1
            }
            console.log(sortObj, query?.maxBudget)
            const collections = await database_connection([ "Request"])
            if (!collections) {
                return
            }
            const requestCollection = collections[0]
            const quotes = requestCollection
                .find({})
                .limit(5)
                .sort(sortObj)
                .toArray()

            return quotes


        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }




    async postRequest(data: any) {
        try {

            const collections = await database_connection(["Request"])
            if (!collections) {
                throw new InternalServerErrorException()
            }
            const requestCollection = collections[0]

            const result = await requestCollection.insertOne(data)

            return result


        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async getOnePartnerById(id: string) {
        try {


            const collections = await database_connection(["Request"])
            if (!collections) {
                throw new InternalServerErrorException()
            }
            const requestCollection = collections[0]

            const result = await requestCollection.findOne({ _id: new ObjectId(id) })


            return result

        } catch (e) {

            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async getAllRequest(setNo: number, projectObj: any, searchQuery: string) {
        try {

            let limit = 10
            let skip = (setNo - 1) * limit


            const collections = await database_connection(["Request"])
            if (!collections) {
                throw new InternalServerErrorException()
            }
            const requestCollection = collections[0]

            const [result, totalCount] = await Promise.all([
                requestCollection.aggregate([
                    {
                        $match: {
                            $or: [
                                { name : { $regex: searchQuery} },
                                { moveFrom: { $regex: searchQuery } },
                                { moveTo: { $regex: searchQuery } },
                                { email: { $regex: searchQuery } }
                            ]
                        }
                    },
                    { $project: projectObj },
                    { $sort: { requestTime: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                ]).toArray(),
                requestCollection.countDocuments({})
            ]);

            return { result, totalCount }

        } catch (e) {

            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async updateRequest(id: string, body: any): Promise<any | undefined> {
        try {

            const collections = await database_connection(["Request"])
            if (!collections) {
                return
            }
            const requestCollection = collections[0]
            const result = requestCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: body
                }
            );
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }



    async getRequestByEmail(email: string, setNo: number) {
        try {

            let limit = 10
            let skip = (setNo - 1) * limit


            const collections = await database_connection(["Request"])
            if (!collections) {
                throw new InternalServerErrorException()
            }
            const requestCollection = collections[0]

            const result = await requestCollection
                .aggregate([
                    { $match: { email: email } },
                    { $sort: { requestTime: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                ])
                .toArray();


            return result

        } catch (e) {

            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    arePointsInsideAnyPolygon(fromLat: number, fromLng: number, toLat: number, toLng: number, polygons: any) {
        let isPoint1Inside = false
        let isPoint2Inside = false
        for (const polygon of polygons) {
            const coordinates = polygon.map((coord: any) => { return { latitude: coord.lat, longitude: coord.lng } });
            let point1 = {
                latitude: fromLat,
                longitude: fromLng
            }
            let point2 = {
                latitude: toLat,
                longitude: toLng
            }
            if (isPointInPolygon(point1, coordinates)) {
                isPoint1Inside = true
            }
            if (isPointInPolygon(point2, coordinates)) {
                isPoint2Inside = true
            }
            if (isPoint1Inside && isPoint2Inside) {
                return true;
            }
        }
        return false;
    }


    async getPartnerEmails(fromLat: number, fromLng: number, toLat: number, toLng: number) {
        try {


            const collections = await database_connection(["Partner"])
            if (!collections) {
                throw new InternalServerErrorException()
            }
            const partnerCollection = collections[0]

            const partners = await partnerCollection.find({}).toArray()

            let emails: any[] = []
            console.log(fromLat, fromLng, toLat, toLng, "LATTTTTTTTTTTTT")
            await Promise.all(partners.map(async (partner: any) => {
                if (partner?.areaPreference === "region") {
                    const regions = partner.regions.map((reg: any) => reg.name)
                    console.log(regions, partner.email)
                    const regionPolygons = await this.regionService.getPolygon(regions)
                    regionPolygons.forEach((polygon: any) => {

                        console.log(this.arePointsInsideAnyPolygon(fromLat, fromLng, toLat, toLng, polygon.multiPolygon))
                        console.log(fromLat, fromLng, toLat, toLng, polygon.name, polygon.multiPolygon)
                        if (this.arePointsInsideAnyPolygon(fromLat, fromLng, toLat, toLng, polygon.multiPolygon)) {
                            emails.push(partner.email)
                        }
                    })

                } else if (partner.areaPreference === "radius") {
                    const latLng = await this.regionService.getLatLng(partner.location)
                    const isPointOneInRadius = isPointWithinRadius(
                        { latitude: fromLat, longitude: fromLng },
                        { latitude: latLng?.lat, longitude: latLng?.lng },
                        partner.radius * 1609.34
                    );
                    const isPointTwoInRadius = isPointWithinRadius(
                        { latitude: toLat, longitude: toLng },
                        { latitude: latLng?.lat, longitude: latLng?.lng },
                        partner.radius * 1609.34
                    );
                    console.log(isPointWithinRadius, isPointTwoInRadius, "isInRadius")
                    if (isPointTwoInRadius && isPointOneInRadius) {
                        emails.push(partner.email)
                    }

                }
            }))

            return emails


        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }



}
