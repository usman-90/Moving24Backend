import { Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Query, Req, UseGuards } from '@nestjs/common';
import { readFileSync } from 'fs';
const ejs = require("ejs")
import { QuotesService } from './quotes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { MailerService } from '../mailer/mailer.service';
import { RegionsService } from '../regions/regions.service';
import { PartnerService } from '../partner/partner.service';


@Controller('quotes')
export class QuotesController {
    constructor(private quoteService: QuotesService, private mailService: MailerService, private regionService: RegionsService, private partnerService: PartnerService) { }



    @HttpCode(HttpStatus.OK)
    @Post("/sendToPartners")
    async sendToPartners(@Body() body: any) {

        try {

            const fromLatLng = await this.regionService.getLatLng(body.moveFrom)
            const toLatLng = await this.regionService.getLatLng(body.moveTo)

            const partnersToSend = await this.quoteService.getPartnerEmails(fromLatLng?.lat, fromLatLng?.lng, toLatLng?.lat, toLatLng?.lng)
            const emails = partnersToSend?.map((elem: any) => elem?.email)

            await this.quoteService.updateRequest(body.id, {
                availablePartners: emails
            })
            if (!emails.length) {
                return {
                    message: "No partners available"
                }
            }
            const requestDetails = await this.quoteService.getOnePartnerById(body.id)
            await this.partnerService.saveToPartner(body.id, emails)

            if (partnersToSend?.length) {
                partnersToSend?.forEach(async (email: any) => {
                    await this.mailService.sendMain({
                        subject: "Moving 24 New Request",
                        html: ejs.render(`
                                         <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moving Request Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .field {
            margin-bottom: 10px;
        }
        .field label {
            font-weight: bold;
        }
        .field span {
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
    <h1>Hi ${email?.companyName ?? ""},</h1>
    <h3>We are pleased to inform you that a new quotation request has been received for your area. The details are as follows:</h3>
        <div class="field">
            <label>Move From:</label>
            <span>${requestDetails?.moveFrom ?? " "}</span>
        </div>
        <div class="field">
            <label>Move To:</label>
            <span>${requestDetails?.moveTo ?? " "}</span>
        </div>
        <div class="field">
            <label>New Property Type:</label>
            <span>${requestDetails?.currPropertyType ?? " "}</span>
        </div>
        <div class="field">
                ${requestDetails?.currPropertyType === "house" ? (
                                `
        <div class="field">
            <label>No of Bedrooms:</label>
            <span>${requestDetails?.currPropertyBedrooms ?? ""}</span>
        </div>
`
                            ) : (
                                `
        <div class="field">
            <label>No of Bedrooms:</label>
            <span>${requestDetails?.currPropertyFloorNo ?? ""}</span>
        </div>
        <div class="field">
            <label>No of Bedrooms:</label>
            <span>${requestDetails?.hasCurrPropertyLift ?? ""}</span>
        </div>
                                `
                            )
                            }
        </div>





        <div class="field">
            <label>New Property Type:</label>
            <span>${requestDetails?.newPropertyType ?? " "}</span>
        </div>
        <div class="field">
                ${requestDetails?.newPropertyType === "house" ? (
                                `
`
                            ) : (
                                `
        <div class="field">
            <label>No of Bedrooms:</label>
            <span>${requestDetails?.newPropertyFloorNo ?? ""}</span>
        </div>
        <div class="field">
            <label>Scope of Work:</label>
            <span>${requestDetails?.hasNewPropertyLift ?? ""}</span>
        </div>
                                `
                            )
                            }
        </div>










        <div class="field">
            <label>New Property Additional Info:</label>
            <ul>
                ${requestDetails?.newPropertyAdditionalInfo?.map((info: any) => {
                                return (
                                    `<ul>${info ?? " "}</ul>`
                                )
                            })
                            }
            </ul>
        </div>
        <div class="field">
            <label>Moving Date Preference:</label>
            <span>${requestDetails?.movingDatePref ?? " "}</span>
        </div>
        <div class="field">
            <label>Name:</label>
            <span>${requestDetails?.name ?? " "}</span>
        </div>
        <div class="field">
            <label>Email:</label>
            <span>${requestDetails?.email ?? " "}</span>
        </div>
        <div class="field">
            <label>Contact Number:</label>
            <span>${requestDetails?.wappNum ?? " "}</span>
        </div>
        <div class="field">
            <label>Minimum Budget :</label>
            <span>${requestDetails?.minBudgetRange ?? " "}</span>
        </div>
        <div class="field">
            <label>Maximum Budget :</label>
            <span>${requestDetails?.maxBudgetRange ?? " "}</span>
        </div>
        <div class="field">
            <label>Building:</label>
            <span>${requestDetails?.building ?? " "}</span>
        </div>
        <div class="field">
            <label>Request Time:</label>
            <span>${requestDetails?.requestTime ?? " "}</span>
        </div>
        <div class="field">
            <label>Date:</label>
            <span>${requestDetails?.movingDatePref === "specific" ? (
                                `
        <div class="field">
            <label>Specific Time:</label>
            <span>${requestDetails?.specificTime ?? " "}</span>
        </div>
        <div class="field">
            <label>Specific Date:</label>
            <span>${requestDetails?.specificDate ?? " "}</span>
        </div>
`

                            ) : (
                                `
        <div class="field">
            <label>Any date between:</label>
            <span>${requestDetails?.startDate ?? " "}</span>
            <span> to </span>
            <span>${requestDetails?.endDate ?? " "}</span>
        </div>
`
                            )}</span>
        </div>
        ${partnersToSend?.length - 1 > 0 ? (
                                `<h3>
            This reques has also been sent to ${partnersToSend?.length - 1} other Companies, their Names are ${partnersToSend?.filter((elem) => elem?.email !== email?.email).map((elem) => elem?.companyName)?.join(" , ")}
        </h3>`
                            ) : (
                                `<h3>
        This request is only sent to you! 
        </h3>`
                            )
                            }
    </div>
</body>
</html>

                                         `
                        ),
                        to: email?.email,
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










    @HttpCode(HttpStatus.OK)
    @Get("getRecent5quotes")
    async getAllRecentPartnerReqs(@Query() query: Record<string, any>) {
        const res = await this.quoteService.getRecent5Requests(query)
        return res
    }



    @HttpCode(HttpStatus.OK)
    @Get("getMaxBudgetQuotes")
    async getTop5MaxBudgetQuotes(@Query() query: Record<string, any>) {
        const res = await this.quoteService.getMaxBudgetQuotes()
        return res
    }







}
