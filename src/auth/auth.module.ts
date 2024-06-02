import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CheckEmailMiddleware } from '../middlewares/CheckEmailAvailablity.middleware';
import { CheckPartnerEmailMiddleware } from '../middlewares/checkPartnerEmailAvailablity.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from '../mailer/mailer.service';
import { PartnerService } from 'src/partner/partner.service';
import { ValidateSignUpData } from '../middlewares/ValidatePartnerSignUp.middleware';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'skdfansoafnwoaienMOVING24ladnflansdjlnlj@__@_12390',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailerService, PartnerService, AdminService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckEmailMiddleware).forRoutes('auth/signup');
    consumer.apply(CheckPartnerEmailMiddleware).forRoutes('auth/partnerSignUp');
    consumer.apply(ValidateSignUpData).forRoutes('auth/partnerSignUp');
  }
}
