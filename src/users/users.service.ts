import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { database_connection } from 'src/db';

export type User = {
    _id:string | ObjectId,
    name:string,
    email:string,
    password:string
}

@Injectable()
export class UsersService {

    async  findOneUser(email: string) : Promise<User | undefined>{
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
}





