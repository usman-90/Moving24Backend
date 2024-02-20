import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
    imports:[UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "dajsdkh823948dk",
      signOptions: { expiresIn: '60s' },
    }),
    ],
  controllers: [AuthController],
  providers: [AuthService,MailerService]
})
export class AuthModule {}
