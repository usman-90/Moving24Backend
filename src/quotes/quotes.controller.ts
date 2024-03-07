import { Body, Controller, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('quotes')
export class QuotesController {
  constructor(private quoteService: QuotesService ){}   
 


    @HttpCode(HttpStatus.OK)
    @Post("/sendToPartners")
    async sendToPartners(@Req() req: any , @Body() body : any) {
        return this.quoteService.sendToPartners(body.lat, body.lng )
    }

}
