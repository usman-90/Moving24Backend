import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { QuotesService } from 'src/quotes/quotes.service';
import { PartnerService } from 'src/partner/partner.service';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService, private quoteService: QuotesService, private partnerService: PartnerService) { }

//    @UseGuards(AuthGuard, RolesGuard)
//    @Roles(["admin"])
    @HttpCode(HttpStatus.OK)
    @Get("getAllQuotations")
    async getAllRequest( @Req() req: any) {
        const projectObj = {
            _id: 1,
            moveFrom:1,
            moveTo:1,
            email:1,
            name:1,
            requestTime:1,
            availablePartners:1
        }
        const res = await this.quoteService.getAllRequest(req?.query?.setNo,projectObj, req?.query?.searchQuery)
        return res
    }


    //    @UseGuards(AuthGuard, RolesGuard)
//    @Roles(["admin"])
    @HttpCode(HttpStatus.OK)
    @Get("getAllPartners")
    async getAllPartners( @Req() req: any) {
        const res = await this.partnerService.getAllPartners(req?.query?.setNo, req.query?.searchQuery, (req.query.isVerified) )
        return res
    }

    //    @UseGuards(AuthGuard, RolesGuard)
//    @Roles(["admin"])
    @HttpCode(HttpStatus.OK)
    @Post("verifyDocument")
    async verifydocument( @Body() body: any) {
        console.log(body?.id,body?.key)
        const res = await this.partnerService.verifyDocument(body?.id, body?.key )
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
            EIN:1,
            regions:1,
            profileImage:1,
        };
        const res = await this.partnerService.getPartnerById(query?.id, projectionObj)
        return res
    }



    @HttpCode(HttpStatus.OK)
    @Get("getOneQuotation")
    async getOneQuotation(@Query() query: Record<string, any>) {
        console.log(query)
        const res = await this.quoteService.getOnePartnerById(query?.id)
        return res
    }













}
