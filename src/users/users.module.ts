import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { QuotesService } from '../quotes/quotes.service';
import { RegionsService } from '../regions/regions.service';
import { AdminService } from '../admin/admin.service';

@Module({
  providers: [UsersService, AdminService, QuotesService, RegionsService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
