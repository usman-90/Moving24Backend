import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { QuotesService } from '../quotes/quotes.service';
import { RegionsService } from '../regions/regions.service';
import { PartnerService } from '../partner/partner.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService,QuotesService,RegionsService,PartnerService]
})
export class AdminModule {}
