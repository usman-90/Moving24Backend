import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CheckEmailMiddleware } from 'src/middlewares/CheckEmailAvailablity.middleware';
import { CheckPartnerEmailMiddleware } from 'src/middlewares/checkPartnerEmailAvailablity.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { PartnerService } from 'src/partner/partner.service';
import { ValidateSignUpData } from 'src/middlewares/ValidatePartnerSignUp.middleware';
import { AdminService } from 'src/admin/admin.service';

@Module({
    imports: [UsersModule,
        JwtModule.register({
            global: true,
            secret:"skdfansoafnwoaienMOVING24ladnflansdjlnlj@__@_12390" ,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, MailerService, PartnerService, AdminService]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckEmailMiddleware)
            .forRoutes('auth/signup');
        consumer.apply(CheckPartnerEmailMiddleware).forRoutes("auth/partnerSignUp")
        consumer.apply(ValidateSignUpData).forRoutes("auth/partnerSignUp")
    }
}
