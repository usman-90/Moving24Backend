import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/hashPassword';
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) { }

    async signIn(password: string, email: string) {
        const user = await this.userService.findOneUserByEmail(email)
        if (!user) {
            throw new NotFoundException()
        }
        const isPasswordValid = await comparePassword(password,user.password)
        if (!(isPasswordValid)) {
            throw new BadRequestException()
        }

        const token = await this.jwtService.signAsync({
            email: user.email,
            _id: user._id
        })

        return token

    }

    async signUp(password: string, email: string, name: string) {
        const insertedUser = await this.userService.insertOneUser(name, email, password)
        if (!insertedUser) {
            throw new ServiceUnavailableException()
        }
        const user = await this.userService.findOneUserById(insertedUser?.insertedId.toString())

        if (!user) {
            throw new ServiceUnavailableException()
        }
        const token = await this.jwtService.signAsync({
            email: user.email,
            _id: user._id
        })

        return token
    }


}
