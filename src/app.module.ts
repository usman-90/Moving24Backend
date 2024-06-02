import { Module, OnModuleInit } from '@nestjs/common';
var cron = require('node-cron');
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
import { PartnerController } from './partner/partner.controller';
import { PartnerService } from './partner/partner.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        UsersModule,
        PartnerModule,
        QuotesModule,
        AdminModule,
        PartnerModule
    ],
    controllers: [AppController, Moving24Controller, RegionsController],
    providers: [AppService, UsersService, MailerService, RegionsService, PartnerService],
})
export class AppModule implements OnModuleInit {
    constructor(private readonly partnerService: PartnerService) { }

    onModuleInit() {
    cron.schedule('0 0 * * *', () => {
        this.partnerService.sendExpirationAlerts();
    });
    }
}
