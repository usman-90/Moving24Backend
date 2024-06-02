import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { database_connection } from 'src/db';
import { hashPassword } from '../utils/hashPassword';

@Injectable()
export class AdminService {
  async insertOneAdmin(userData: any): Promise<any | undefined> {
    try {
      const collections = await database_connection(['Admin']);
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
        createdAt: new Date(),
      });
      return result;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAdminByEmail(
    email: string,
    projectionObj: any = {},
  ): Promise<any | undefined> {
    try {
      const collections = await database_connection(['Admin']);
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

    async getAdminDetails(id: string, projectionObj: any): Promise<any | undefined> {
        try {

            const collections = await database_connection(["Admin"])
            if (!collections) {
                return
            }
            const partnerCollection = collections[0]
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
  
  async updateAdminDetails(id: string, body: any): Promise<any | undefined> {
    try {
      const collections = await database_connection(['Admin']);
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



    async getMinimumBudget(): Promise<any | undefined> {
        try {

            const collections = await database_connection(["WebsiteData"])
            if (!collections) {
                return
            }
            const websiteDataCollection = collections[0]
            const result = websiteDataCollection.findOne(
                { name: "minimumBudgetRange" },
            );
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }




    async updateMinimumBudget(minimumBudgetRange: string): Promise<any | undefined> {
        try {

            const collections = await database_connection(["WebsiteData"])
            if (!collections) {
                return
            }
            const websiteDataCollection = collections[0]
            console.log(minimumBudgetRange)
            const result = websiteDataCollection.updateOne(
                { name: "minimumBudgetRange" },
                {
                    $set: {
                        minimumBudgetRange: parseInt(minimumBudgetRange)
                    }
                },
                { upsert: true }
            );
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async updateAdminPassword(id: string, body: any): Promise<any | undefined> {
        try {

            const collections = await database_connection(["Admin"])
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
  }

