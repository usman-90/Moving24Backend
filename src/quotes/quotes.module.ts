import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { RegionsService } from 'src/regions/regions.service';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService,RegionsService]
})
export class QuotesModule {}
