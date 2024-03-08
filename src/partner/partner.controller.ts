import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('partner')
export class PartnerController {
    constructor(private partnerService: PartnerService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(["partner"])
    @HttpCode(HttpStatus.OK)
    @Post("insertProof")
    async insertProofs(@Body() body: Record<string, any>, @Req() req: any) {
        const res = await this.partnerService.insertPartnerProofs(req.user.email, body)
        return res
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(["partner"])
    @HttpCode(HttpStatus.OK)
    @Put("updatePartnerDetails")
    async updateNameAddr(@Body() body: Record<string, any>, @Req() req: any) {
        const res = await this.partnerService.updatePartnerDetails(req.user._id, body)
        return res
    }



    @HttpCode(HttpStatus.OK)
    @Get("getOnePartner")
    async getOnePartnerById(@Query() query: Record<string, any>) {
        console.log(query)
        let projectionObj = {
            _id: 1,
            email: 1,
            removalType: 1,
            areaPreference: 1,
            companyName: 1,
            businessType: 1,
            noOfEmployees: 1,
            telephone: 1,
            addressLine1: 1,
            city: 1,
            state: 1,
            salutation: 1,
            firstName: 1,
            lastName: 1,
            userName: 1,
            location: 1,
            radius: 1,
            about:1,
            ans1:1,
            ans2:1,
            ans3:1,
            EIN:1,
            images:1,
            regions:1
        };
        const res = await this.partnerService.getPartnerById(query?.id, projectionObj)
        return res
    }




    @HttpCode(HttpStatus.OK)
    @Get("getrecentpartnerreqs")
    async getPartnerRequests(@Query() query: Record<string, any>) {
        console.log(query)
        const res = await this.partnerService.get5PartnerQuotes(query?.email)
        return res
    }







}
