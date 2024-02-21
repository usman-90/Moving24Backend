import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { QuotesService } from './quotes.service';
@Controller('quotes')
export class QuotesController {
  constructor(private quoteService: QuotesService){}   
    
    @HttpCode(HttpStatus.OK)
    @Post("quoteRequest")
    quoteRequest(@Body() body: Record <string, any>) {
        return this.quoteService.postRequest(body)
    }


}
