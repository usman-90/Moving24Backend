import { GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { database_connection } from 'src/db';
import { hashPassword } from 'src/utils/hashPassword';

export type User = {
    _id:string | ObjectId,
    name:string,
    email:string,
    password:string
}

@Injectable()
export class UsersService {

    async  findOneUserByEmail(email: string) : Promise<User | undefined>{
        try{
        const collections = await database_connection(["User"])
        if (!collections){
            return
        }
        const userCollection = collections[0]
        const result = userCollection.findOne({email: email})
        return result
        }catch(e){
            console.log(e)
        }
    }


    async  findOneUserById(id: string) : Promise<User | undefined>{
        try{
        const collections = await database_connection(["User"])
        if (!collections){
            return
        }
        const userCollection = collections[0]
        console.log(id)
        const result = userCollection.findOne({_id: new ObjectId(id)})
        return result
        }catch(e){
            console.log(e)
        }
    }


    async insertOneUser(name: string, email: string, password: string): Promise<any | undefined>{
         try{
            const collections = await database_connection(["User"])
            if (!collections){
                return
            }
            const userCollection = collections[0]
            const hashedPassword = await hashPassword(password)
            const result = userCollection.insertOne({
                name,
                email,
              password: hashedPassword 
            })
            return result
         }catch(e){
            console.log(e)
            throw new InternalServerErrorException()
         }
    }
}





