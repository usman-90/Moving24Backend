import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { database_connection } from 'src/db';

@Injectable()
export class QuotesService {
    async postRequest(data: any){
        try {

            const collections = await database_connection(["Request"])
            if (!collections){
                throw new InternalServerErrorException()
            }
            const requestCollection = collections[0]

            const result = await requestCollection.insertOne(data)

            return result


        }catch(e){
            console.log(e)
            throw new InternalServerErrorException()
        }
    }
}
