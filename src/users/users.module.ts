import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { QuotesService } from 'src/quotes/quotes.service';

@Module({
    providers:[UsersService, QuotesService],
    exports:[UsersService],
    controllers: [UsersController]
})
export class UsersModule {}
