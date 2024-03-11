import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { QuotesService } from 'src/quotes/quotes.service';
import { RegionsService } from 'src/regions/regions.service';
import { PartnerService } from 'src/partner/partner.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService,QuotesService,RegionsService,PartnerService]
})
export class AdminModule {}
