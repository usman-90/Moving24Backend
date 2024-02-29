import { GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { database_connection } from 'src/db';
import { hashPassword } from 'src/utils/hashPassword';

export type User = {
    _id: string | ObjectId,
    name: string,
    email: string,
    password: string
}

@Injectable()
export class UsersService {

    async findOneUserByEmail(email: string): Promise<User | undefined> {
        try {
            const collections = await database_connection(["User"])
            if (!collections) {
                return
            }
            const userCollection = collections[0]
            const result = userCollection.findOne({ email: email },{password:0})
            return result
        } catch (e) {
            console.log(e)
        }
    }


    async findOneUserById(id: string): Promise<User | undefined> {
        try {
            const collections = await database_connection(["User"])
            if (!collections) {
                return
            }
            const userCollection = collections[0]
            console.log(id)
            const result = userCollection.findOne({ _id: new ObjectId(id) })
            return result
        } catch (e) {
            console.log(e)
        }
    }


    async insertOneUser(userData: any): Promise<any | undefined> {
        try {
            const collections = await database_connection(["User"])
            if (!collections) {
                return
            }
            const { password, ...otherData } = userData
            const userCollection = collections[0]
            console.log(password, otherData)
            const hashedPassword = await hashPassword(password)
            const result = userCollection.insertOne({
                ...otherData,
                password: hashedPassword
            })
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async updateUserCodeByEmail(email: string, code: string): Promise<any | undefined> {
        try {
            const collections = await database_connection(["User"])
            if (!collections) {
                throw new InternalServerErrorException()
            }
            const userCollection = collections[0]
            const update = userCollection.updateOne(
                { email: email },
                { $set: { "code": code, verified: false } }
            )
            return update

        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async insertOneCustomer(email: string, code: string): Promise<any | undefined> {
        try {
            const collections = await database_connection(["User"])
            if (!collections) {
                return
            }
            const userCollection = collections[0]
            const result = userCollection.insertOne({
                email,
                code,
                verified: false
            })
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async getUserCode(email: string): Promise<any | undefined> {
        try {
            const collections = await database_connection(["User"])
            if (!collections) {
                return
            }
            const userCollection = collections[0]
            const result = userCollection.findOne({
                email,
            }, {
                code: 1,
                email: 1
            })
            return result

        } catch (e) {
            throw new InternalServerErrorException()
        }
    }


    async setVerifiedTrue(email: string): Promise<any | undefined> {
        try {
            const collections = await database_connection(["User"])
            if (!collections) {
                throw new InternalServerErrorException()
            }
            const userCollection = collections[0]
            const update = userCollection.updateOne(
                { email: email },
                { $set: { "verified": true } }
            )
            return update

        } catch (e) {
            throw new InternalServerErrorException()
        }
    }



}





