import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [PartnerController],
  providers: [PartnerService,MailerService],
  exports: [PartnerService],
})
export class PartnerModule {}
