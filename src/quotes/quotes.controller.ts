import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('quotes')
export class QuotesController {
  constructor(private quoteService: QuotesService ){}   
    

}
