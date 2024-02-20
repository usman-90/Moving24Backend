import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/hashPassword';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';




@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private mailerService: MailerService, private jwtService: JwtService) { }

    async signIn(password: string, email: string) {
        const user = await this.userService.findOneUserByEmail(email)
        if (!user) {
            throw new NotFoundException()
        }
        const isPasswordValid = await comparePassword(password, user.password)
        if (!(isPasswordValid)) {
            throw new BadRequestException()
        }

        const token = await this.jwtService.signAsync({
            email: user.email,
            _id: user._id
        })

        return token

    }

    async signUp(userData: any) {
        const insertedUser = await this.userService.insertOneUser(userData)
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

    async sendVerificationEmail(email: string, code: string) {
        await this.mailerService.sendMain({
            subject: "Moving 24 Verification",
            text: "Your verification code is " + code,
            to: email,
            from: process.env.EMAIL
        })

        const user = await this.userService.findOneUserByEmail(email)
        if (user){
            await this.userService.updateUserCodeByEmail(email,code)
        }else{
            await this.userService.insertOneCustomer(email,code)
        }

        return true
    }

    async verifyCode(email: string, code : string){
        const user = await this.userService.getUserCode(email)
        if (user.code === code){
            const res = await this.userService.setVerifiedTrue(email)
            return {
                user,
                res,
                verified: true
            }
        }else{
            throw new BadRequestException({
                message:"wrong code"
            })
        }
    }

}
