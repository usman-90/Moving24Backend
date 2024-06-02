import { Injectable, InternalServerErrorException } from '@nestjs/common';
const ejs = require('ejs');
import { ObjectId } from 'mongodb';
import { database_connection } from '../db';
import { hashPassword } from '../utils/hashPassword';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class PartnerService {
    constructor(private mailerService: MailerService) { }
    async insertOnePartner(userData: any): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            const { password, ...otherData } = userData;
            const userCollection = collections[0];
            console.log(password, otherData);
            const hashedPassword = await hashPassword(password);
            const result = userCollection.insertOne({
                ...otherData,
                password: hashedPassword,
                proof: {},
                about: '',
                images: [],
                isVerified: false,
                createdAt: new Date(),
                profileImage: '',
                lastRequestReceivedOn: null
            });
            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async getPartnerById(
        id: string,
        projectionObj: any = {},
    ): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            const partnerCollection = collections[0];
            console.log(projectionObj);
            const result = partnerCollection.findOne(
                { _id: new ObjectId(id) },
                { projection: projectionObj },
            );
            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async verifyDocument(id: string, key: any): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            const partnerCollection = collections[0];
            const setObj: any = {};
            setObj['proof.' + key + '.verified'] = true;

            const result = await partnerCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: setObj,
                },
            );
            console.log(setObj, result)
            if (result?.modifiedCount === 1) {
                var res = await partnerCollection.findOne(
                    { _id: new ObjectId(id) },
                    {
                        proof: 1,
                    },
                );
                if (
                    res?.proof?.VATcert?.verified &&
                    res?.proof?.emiratesId?.verified &&
                    res?.proof?.insuranceCert?.verified &&
                    res?.proof?.license?.verified
                ) {
                    var res2 = await partnerCollection.updateOne(
                        { _id: new ObjectId(id) },
                        {
                            $set: {
                                isVerified: true,
                            },
                        },
                    );
                }
                console.log(res);
            }
            return [result, res2];
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async updatePartnerDetails(id: string, body: any): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            const partnerCollection = collections[0];
            const result = partnerCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: body,
                },
            );
            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async updatePartnerPassword(id: string, body: any): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            console.log(body);
            const partnerCollection = collections[0];
            const result = partnerCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        password: await hashPassword(body.password),
                    },
                },
            );
            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async getManyPartnerByEmail(
        emails: string[],
        projectionObj: any = {},
    ): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            const partnerCollection = collections[0];
            console.log(projectionObj);
            const result = partnerCollection
                .find(
                    {
                        email: { $in: emails },
                    },
                    projectionObj,
                )
                .toArray();
            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async getPartnerByEmail(
        email: string,
        projectionObj: any = {},
    ): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            const partnerCollection = collections[0];
            console.log(projectionObj);
            const result = partnerCollection.findOne(
                { email },
                { projection: projectionObj },
            );
            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async insertPartnerProofs(
        email: string,
        data: any,
    ): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);

            if (!collections) {
                return;
            }
            const partnerCollection = collections[0];
            console.log(data, 'prooofssssss');
            const result = partnerCollection.updateOne(
                {
                    email,
                },
                {
                    $set: {
                        'proof.license': { ...data.license, expirationDate: new Date(data?.license?.expirationDate) },
                        'proof.VATcert': { ...data.VATcert, expirationDate: new Date(data?.VATcert?.expirationDate) },
                        'proof.emiratesId': { ...data.emiratesId, expirationDate: new Date(data?.emiratesId?.expirationDate) },
                        'proof.insuranceCert': { ...data.insuranceCert, expirationDate: new Date(data?.insuranceCert?.expirationDate) },
                    },
                },
            );
            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async getPartnerProofs(email: string): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);

            if (!collections) {
                return;
            }
            const partnerCollection = collections[0];
            const result = partnerCollection.findOne(
                {
                    email,
                },
                {
                    proof: 1,
                },
            );
            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async getPartnerProofsById(id: string): Promise<any | undefined> {
        try {
            const collections = await database_connection(["Partner"])

            if (!collections) {
                return
            }
            console.log(id)
            const partnerCollection = collections[0]
            const result = partnerCollection.findOne({
                _id: new ObjectId(id),
            }, {
                proof: 1
            })
            console.log(result)
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }



    async updatePartnerProofs(id: string, proofs: any): Promise<any | undefined> {
        try {
            const collections = await database_connection(["Partner"])
            console.log(proofs)

            if (!collections) {
                return
            }

            console.log(id)
            const partnerCollection = collections[0]

            const res = await partnerCollection.findOne({
                _id: new ObjectId(id),
            }, {
                proof: 1
            })
            const mongoQuery = {
                $set: {
                    proof: { ...res?.proof, ...proofs },
                    isVerified: false
                }
            }
            const result = await partnerCollection.updateOne(
                { _id: new ObjectId(id) },
                mongoQuery
            );

            return result

        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async saveToPartner(id: string, emails: string[]): Promise<any | undefined> {
        try {
            if (!emails.length) {
                return;
            }
            const collections = await database_connection(['PRjunction']);
            if (!collections) {
                return;
            }
            const PRjunctionCollection = collections[0];
            const tempObjs = emails.map((email: string) => {
                return {
                    partnerEmail: email,
                    quoteId: id,
                };
            });

            const result = PRjunctionCollection.insertMany(tempObjs);

            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }


    async updateLastReceivedDate(email : string): Promise<any | undefined> {
        try {
            if (!email) {
                return;
            }
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            const PartnerCollection = collections[0];
            const result = PartnerCollection.updateOne(
                { email : email },
                {
                    $set: {
                        lastRequestReceivedOn: new Date()
                    },
                },
            );
            console.log(result)
            return result;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async get5PartnerQuotes(email: string): Promise<any | undefined> {
        try {
            const collections = await database_connection(['PRjunction', 'Request']);
            if (!collections) {
                return;
            }
            const PRjunctionCollection = collections[0];
            const requestCollection = collections[1];
            const res = await PRjunctionCollection.find({
                partnerEmail: email,
            }).toArray();
            const reqIds = res.map((elem: any) => new ObjectId(elem?.quoteId));
            console.log(reqIds, 'idssssss');
            const quotes = requestCollection
                .find({ _id: { $in: reqIds } })
                .limit(5)
                .sort({ date: 1 })
                .toArray();

            return quotes;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async getPartnerQuotes(
        email: string,
        pageNo: string,
        fromDate: string,
        toDate: string,
        searchQuery: string,
    ): Promise<any | undefined> {
        try {
            const collections = await database_connection(['PRjunction', 'Request']);
            if (!collections) {
                return;
            }
            const PRjunctionCollection = collections[0];
            const requestCollection = collections[1];
            const res = await PRjunctionCollection.find({
                partnerEmail: email,
            }).toArray();
            const reqIds = res.map((elem: any) => new ObjectId(elem?.quoteId));
            const newFromDate = new Date(fromDate);
            const newToDate = new Date(toDate);
            const query: any = {
                _id: { $in: reqIds },
            };
            if (searchQuery) {
                query['name'] = { $regex: searchQuery, $options: 'i' };
            }
            if (!isNaN(newFromDate.getTime()) && !isNaN(newToDate.getTime())) {
                query['requestTime'] = { $gte: newFromDate, $lte: newToDate };
            }
            const quotes = await requestCollection
                .find(query)
                .skip(parseInt(pageNo) * 10)
                .sort({ requestTime: -1 })
                .limit(10)
                .toArray();
            return { quotes: quotes, total: reqIds.length };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async getAllPartners(
        setNo: string,
        searchQuery: string,
        isVerified: string,
    ): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            const partnerCollection = collections[0];
            const query: any = {};
            if (searchQuery) {
                query['companyName'] = { $regex: searchQuery, $options: 'i' };
            }
            if (isVerified === 'true') {
                query['isVerified'] = true;
            } else if (isVerified === 'false') {
                query['isVerified'] = false;
            }
            console.log(query);
            const [partners, total] = await Promise.all([
                partnerCollection
                    .find(query)
                    .skip((parseInt(setNo) - 1) * 10)
                    .limit(10)
                    .toArray(),
                partnerCollection.countDocuments({}),
            ]);

            return { partners, total };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async sendExpirationAlerts(): Promise<any | undefined> {
        try {
            const collections = await database_connection(['Partner']);
            if (!collections) {
                return;
            }
            const partnerCollection = collections[0];
            const query: any = { isVerified: true };
            console.log(query);
            const partners = await partnerCollection.aggregate([
                {
                    $project: {
                        email: '$email',
                        documents: { $objectToArray: '$proof' },
                    },
                },
                { $unwind: '$documents' },
                {
                    $match: {
                        'documents.v.expirationDate': {
                            $gte: new Date(),
                            $lte: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                        },
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        email: { $first: '$email' },
                        documentNames: { $push: '$documents.v.name' },
                    },
                },
            ]).toArray();

            partners.forEach((partner: any) => {
                console.log(partner)
            })

            if (partners?.length) {
                partners?.forEach(async (partner: any) => {
                    await this.mailerService.sendMain({
                        subject: 'Renew Your Moving24 Documents',
                        html: ejs.render(`
                                         <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moving Request Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .field {
            margin-bottom: 10px;
        }
        .field label {
            font-weight: bold;
        }
        .field span {
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
    <h1>Hi</h1>
    <h3>
    Your Following documents are going to expire with in a week, Kindly renew them.
        </h3>

    <ol>
                ${partner?.documentNames?.map(
                            (name: any) => {
                                return `<li>${name ?? ' '}</li>`;
                            },
                        )}
    </ol>
    </div>
</body>
</html>

                                         `),
                        to: partner?.email,
                        from: process.env.EMAIL,
                    });
                })
            }


        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}