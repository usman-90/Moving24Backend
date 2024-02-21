import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Moving24Controller } from './moving24.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { MailerService } from './mailer/mailer.service';
import { PartnerModule } from './partner/partner.module';
import { QuotesModule } from './quotes/quotes.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, PartnerModule, QuotesModule],
  controllers: [AppController, Moving24Controller],
  providers: [AppService, UsersService, MailerService],
})
export class AppModule {}
