import { Injectable , UnauthorizedException} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.service';




@Injectable()
export class AuthService {
    constructor (private userService: UsersService){}

    async signIn ( password:string, email: string ){
        const user = await this.userService.findOneUser(email)
        if (password !== user?.password){
            throw  new UnauthorizedException()
        }
        
        const {password , ...result} = user

    
    }


}
