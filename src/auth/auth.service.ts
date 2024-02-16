import { Injectable , UnauthorizedException} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor (private userService: UsersService){}


}
