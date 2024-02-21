import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.password, signInDto.email);
    }



    @HttpCode(HttpStatus.OK)
    @Post('partnerSignUp')
    partnerSignUp(@Body() signInDto: Record<string, any>) {
        let userData = {
            email: signInDto.email,
            password: signInDto.password,
            removalType: signInDto.removalType,
            areaPreference: signInDto.areaPreference,
            location: signInDto.location,
            radius: signInDto.radius,
            companyName: signInDto.companyName,
            businessType: signInDto.businessType,
            noOfEmployees: signInDto.noOfEmployees,
            telephone: signInDto.telephone,
            addressLine1: signInDto.addressLine1,
            city: signInDto.city,
            state: signInDto.state,
            salutation: signInDto.salutation,
            firstName: signInDto.firstName,
            lastName: signInDto.lastName,
            userName: signInDto.userName,
        }

        return this.authService.partnerSignUp(userData);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sendVerificationCode')
    customerSignUp(@Body() signInDto: Record<string, any>) {
        const randomNum = Math.random() * 9000
        return this.authService.sendVerificationEmail(signInDto.email, Math.floor(1000 + randomNum).toString());
    }

    @HttpCode(HttpStatus.OK)
    @Post('verifyCode')
    verifyCode(@Body() signInDto: Record<string, any>) {
        return this.authService.verifyCode(signInDto.email, signInDto.code);
    }
}
