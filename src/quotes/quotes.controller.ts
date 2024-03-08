import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post, Query, Req, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { MailerService } from 'src/mailer/mailer.service';
import { RegionsService } from 'src/regions/regions.service';
import { PartnerService } from 'src/partner/partner.service';
@Controller('quotes')
export class QuotesController {
    constructor(private quoteService: QuotesService, private mailService: MailerService, private regionService: RegionsService, private partnerService: PartnerService) { }



    @HttpCode(HttpStatus.OK)
    @Post("/sendToPartners")
    async sendToPartners(@Body() body: any) {

        try {

            const fromLatLng = await this.regionService.getLatLng(body.moveFrom)
            const toLatLng = await this.regionService.getLatLng(body.moveTo)

            const emails = await this.quoteService.getPartnerEmails(fromLatLng?.lat, fromLatLng?.lng, toLatLng?.lat, toLatLng?.lng)
            await this.partnerService.saveToPartner(body.id, emails)
            if (emails.length) {
                emails.forEach(async (email: string) => {
                    await this.mailService.sendMain({
                        subject: "Moving 24 New Request",
                        text: "New Request for you",
                        to: email,
                        from: process.env.EMAIL
                    })

                })

            }
            return emails
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

}
