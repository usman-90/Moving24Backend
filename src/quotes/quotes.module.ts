import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { RegionsService } from 'src/regions/regions.service';
import { MailerService } from 'src/mailer/mailer.service';
import { PartnerService } from 'src/partner/partner.service';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService,RegionsService, MailerService,PartnerService]
})
export class QuotesModule {}
