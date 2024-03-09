import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { database_connection } from 'src/db';
import { hashPassword } from 'src/utils/hashPassword';

@Injectable()
export class PartnerService {

    async insertOnePartner(userData: any): Promise<any | undefined> {
        try {
            const collections = await database_connection(["Partner"])
            if (!collections) {
                return
            }
            const { password, ...otherData } = userData
            const userCollection = collections[0]
            console.log(password, otherData)
            const hashedPassword = await hashPassword(password)
            const result = userCollection.insertOne({
                ...otherData,
                password: hashedPassword,
                proof: {},
                about: "",
                images: [],
                isVerified: false,
                createdAt: new Date(),
                profileImage: ""
            })
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async getPartnerById(id: string, projectionObj: any = {}): Promise<any | undefined> {
        try {

            const collections = await database_connection(["Partner"])
            if (!collections) {
                return
            }
            const partnerCollection = collections[0]
            console.log(projectionObj)
            const result = partnerCollection.findOne(
                { _id: new ObjectId(id) },
                { projection: projectionObj }
            );
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async updatePartnerDetails(id: string, body: any): Promise<any | undefined> {
        try {

            const collections = await database_connection(["Partner"])
            if (!collections) {
                return
            }
            const partnerCollection = collections[0]
            const result = partnerCollection.updateOne(
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


    async updatePartnerPassword(id: string, body: any): Promise<any | undefined> {
        try {

            const collections = await database_connection(["Partner"])
            if (!collections) {
                return
            }
            console.log(body)
            const partnerCollection = collections[0]
            const result = partnerCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        password: await hashPassword(body.password)
                    } 
                }
            );
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }









    async getPartnerByEmail(email: string, projectionObj: any = {}): Promise<any | undefined> {
        try {

            const collections = await database_connection(["Partner"])
            if (!collections) {
                return
            }
            const partnerCollection = collections[0]
            console.log(projectionObj)
            const result = partnerCollection.findOne(
                { email },
                { projection: projectionObj }
            );
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async insertPartnerProofs(email: string, data: any): Promise<any | undefined> {
        try {
            const collections = await database_connection(["Partner"])

            if (!collections) {
                return
            }
            const partnerCollection = collections[0]
            console.log(data, "prooofssssss")
            const result = partnerCollection.updateOne({
                email,
            }, {
                $set: {
                    "proof.license": data.license,
                    "proof.VATcert": data.VATcert,
                    "proof.emiratesId": data.emiratesId,
                    "proof.insuranceCert": data.insuranceCert,
                }
            })
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async getPartnerProofs(email: string): Promise<any | undefined> {
        try {
            const collections = await database_connection(["Partner"])

            if (!collections) {
                return
            }
            const partnerCollection = collections[0]
            const result = partnerCollection.findOne({
                email,
            }, {
                proof: 1
            })
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async saveToPartner(id: string, emails: string[]): Promise<any | undefined> {
        try {

            const collections = await database_connection(["PRjunction"])
            if (!collections) {
                return
            }
            const PRjunctionCollection = collections[0]
            const tempObjs = emails.map((email: string) => {
                return {
                    partnerEmail: email,
                    quoteId: id
                }
            })
            const result = PRjunctionCollection.insertMany(tempObjs);

            return result


        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async get5PartnerQuotes(email: string): Promise<any | undefined> {
        try {

            const collections = await database_connection(["PRjunction", "Request"])
            if (!collections) {
                return
            }
            const PRjunctionCollection = collections[0]
            const requestCollection = collections[1]
            const res = await PRjunctionCollection.find({ partnerEmail: email }).toArray()
            const reqIds = res.map((elem: any) => new ObjectId(elem?.quoteId))
            console.log(reqIds, "idssssss")
            const quotes = requestCollection
                .find({ _id: { $in: reqIds } })
                .limit(5)
                .sort({ date: 1 })
                .toArray()

            return quotes


        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async getPartnerQuotes(email: string, pageNo: string, fromDate: string, toDate: string, searchQuery: string): Promise<any | undefined> {
        try {

            const collections = await database_connection(["PRjunction", "Request"])
            if (!collections) {
                return
            }
            const PRjunctionCollection = collections[0]
            const requestCollection = collections[1]
            const res = await PRjunctionCollection.find({ partnerEmail: email }).toArray()
            const reqIds = res.map((elem: any) => new ObjectId(elem?.quoteId))
            const newFromDate = new Date(fromDate)
            const newToDate = new Date(toDate)
            const query : any = {
                "_id": { "$in": reqIds },
            }
            if (searchQuery) {
                query["name"] = { "$regex": searchQuery, "$options": "i" }
            }
            if (!isNaN(newFromDate.getTime()) && !isNaN(newToDate.getTime())) {
                query["requestTime"] = { "$gte": newFromDate, "$lte": newToDate }
            }
            const quotes = await requestCollection.find(query).skip(parseInt(pageNo) * 10).limit(10).toArray();
            return {quotes:quotes,total: reqIds.length}


        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

}
