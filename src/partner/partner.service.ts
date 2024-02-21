import { Injectable , InternalServerErrorException} from '@nestjs/common';
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
                password: hashedPassword
            })
            return result
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async getPartnerByEmail (email: string) : Promise <any | undefined> {
        try{
            const collections = await database_connection(["Partner"])

            if (!collections) {
                return
            }
            const partnerCollection = collections[0]
            const result = partnerCollection.findOne({
                email,
            })
            return result
        }catch(e){
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

}
