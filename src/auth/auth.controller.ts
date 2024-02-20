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

        return this.authService.signUp(userData);
    }

    @HttpCode(HttpStatus.OK)
    @Post('customer/signUp')
    customerSignUp(@Body() signInDto: Record<string, any>) {
        return this.authService.signUp(signInDto.password, signInDto.email, signInDto.name);
    }

}
