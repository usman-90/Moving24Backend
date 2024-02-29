import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('partnerLogin')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.password, signInDto.email);
    }



    @HttpCode(HttpStatus.OK)
    @Post('partnerSignUp')
    partnerSignUp(@Body() signInDto: Record<string, any>) {
        return this.authService.partnerSignUp(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sendVerificationCode')
    customerSignUp(@Body() signInDto: Record<string, any>) {
        const randomNum = Math.random() * 9000
        return this.authService.sendVerificationEmailToUser(signInDto.email, Math.floor(1000 + randomNum).toString());
    }

    @HttpCode(HttpStatus.OK)
    @Post('verifyCode')
    verifyCode(@Body() signInDto: Record<string, any>) {
        return this.authService.verifyCode(signInDto.email, signInDto.code);
    }
}
