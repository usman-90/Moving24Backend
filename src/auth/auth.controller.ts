import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
    @Post('signUp')
    signUp(@Body() signInDto: Record<string, any>) {
        return this.authService.signUp(signInDto.password, signInDto.email, signInDto.name);
    }


}
