import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isPointInPolygon } from 'geolib';
import { database_connection } from 'src/db';
import { RegionsService } from 'src/regions/regions.service';

@Injectable()
export class QuotesService {

    constructor(private regionService : RegionsService){}

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


    isPointInsideAnyPolygon(point :any, polygons : any) {
        console.log(point)
    for (const polygon of polygons) {
        const coordinates = polygon.map((coord: any) =>{return {latitude:coord.lat, longitude:coord.lng}});
//        console.log(isPointInPolygon(point,coordinates))
        if (isPointInPolygon(point, coordinates)) {
            return true; // Point is inside this polygon
        }
    }
    return false; // Point is not inside any polygon
}


    async sendToPartners(lat: number, lng: number) {
        try {


            const collections = await database_connection(["Partner"])
            if (!collections) {
                throw new InternalServerErrorException()
            }
            const partnerCollection = collections[0]
            
            const partners = await partnerCollection.find({}).toArray()

            let email : any[] = []
    
            partners.forEach( async (partner : any) => {
                if (partner?.areaPreference === "region"){
                    const regions = partner.regions.map((reg : any) => reg.name)
                    const regionPolygons = await this.regionService.getPolygon(regions)
                    regionPolygons.forEach((polygon : any) => {
                        if (this.isPointInsideAnyPolygon({latitude:lat,longitude:lng},polygon.multiPolygon)){
                        console.log((this.isPointInsideAnyPolygon({latitude:lat,longitude:lng},polygon.multiPolygon)),"hereeeeeee")
                        console.log(partner,"hereeeeeee")
                            email.push(partner.email)
                            console.log(email)
                        }
                    })
                        
                }
            })

            return email


        } catch (e) {

            console.log(e)
            throw new InternalServerErrorException()
        }
    }




















}
