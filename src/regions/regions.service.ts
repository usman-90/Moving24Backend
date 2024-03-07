import { Injectable } from '@nestjs/common';
import { database_connection } from 'src/db';

@Injectable()
export class RegionsService {

    async getPolygon (namesArr : string[]){
        try {
            const collections = await database_connection(["Regions"])
            if (!collections) {
                return
            }
            const regionCollection = collections[0]
            const result = await regionCollection.find({ name: { $in: namesArr } }).toArray()
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async getAllRegions (){
        try {
            const collections = await database_connection(["Regions"])
            if (!collections) {
                return
            }
            const regionCollection = collections[0]
            const result = await regionCollection.find({}).project({ name: 1 }).toArray()
            return result
        } catch (e) {
            console.log(e)
        }
    }


}
