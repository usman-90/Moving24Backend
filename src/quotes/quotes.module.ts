import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { RegionsService } from '../regions/regions.service';
import { MailerService } from '../mailer/mailer.service';
import { PartnerService } from '../partner/partner.service';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService, RegionsService, MailerService, PartnerService],
})
export class QuotesModule {}
