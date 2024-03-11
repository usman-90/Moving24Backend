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
import { RegionsService } from './regions/regions.service';
import { RegionsController } from './regions/regions.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, PartnerModule, QuotesModule, AdminModule],
  controllers: [AppController, Moving24Controller, RegionsController],
  providers: [AppService, UsersService, MailerService, RegionsService],
})
export class AppModule {}
