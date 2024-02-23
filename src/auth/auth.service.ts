import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/hashPassword';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { PartnerService } from 'src/partner/partner.service';




@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private mailerService: MailerService, private jwtService: JwtService , private partnerService : PartnerService) { }

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
            _id: user._id.toString(),
            roles: ["partner"],
        })

        return token

    }

    async partnerSignUp(userData: any) {
        const insertedUser = await this.partnerService.insertOnePartner(userData)
        if (!insertedUser) {
            throw new ServiceUnavailableException()
        }
        const token = await this.jwtService.signAsync({
            email: userData.email,
            _id: insertedUser?.insertedId.toString(),
            roles: ["partner"],
        })

        return token
    }

    async sendVerificationEmailToUser(email: string, code: string) {
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
