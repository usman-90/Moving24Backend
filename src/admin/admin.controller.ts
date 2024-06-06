import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { QuotesService } from '../quotes/quotes.service';
import { PartnerService } from '../partner/partner.service';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private quoteService: QuotesService,
    private partnerService: PartnerService,
  ) {}

  //    @UseGuards(AuthGuard, RolesGuard)
  //    @Roles(["admin"])
  @HttpCode(HttpStatus.OK)
  @Get('getAllQuotations')
  async getAllRequest(@Req() req: any) {
    const projectObj = {
      _id: 1,
      moveFrom: 1,
      moveTo: 1,
      email: 1,
      name: 1,
      requestTime: 1,
      availablePartners: 1,
    };
    const res = await this.quoteService.getAllRequest(
      req?.query?.setNo,
      projectObj,
      req?.query?.searchQuery,
    );
    return res;
  }

  //    @UseGuards(AuthGuard, RolesGuard)
  //    @Roles(["admin"])
  @HttpCode(HttpStatus.OK)
  @Get('getWeeklyQuotations')
  async getWeeklyRequests(@Req() req: any) {
    const projectObj = {
      _id: 1,
      moveFrom: 1,
      moveTo: 1,
      email: 1,
      name: 1,
      requestTime: 1,
      availablePartners: 1,
    };
    console.log(req?.query?.setNo,1)
    console.log(req?.query?.searchQuery,2)
    console.log(req?.query?.week,3)
    const res = await this.quoteService.getWeeklyQuotation(
      req?.query?.setNo,
      projectObj,
      req?.query?.searchQuery,
      parseInt(req?.query?.week?.split("-")[1])
    );
    return res;
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
    @Put("updateMinimumBudgetRange")
    async updateMinimumBudgetRange( @Req() req: any, @Body() body: any) {
        const res = await this.adminService.updateMinimumBudget(body?.minimumBudget)
        return res
    }


    //    @UseGuards(AuthGuard, RolesGuard)
//    @Roles(["admin"])
    @HttpCode(HttpStatus.OK)
    @Get("getMinimumBudgetRange")
    async getMinimumBudgetRange() {
        const res = await this.adminService.getMinimumBudget()
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


    //    @UseGuards(AuthGuard, RolesGuard)
//    @Roles(["admin"])
    @HttpCode(HttpStatus.OK)
    @Get("getWeeklySales")
    async getWeeklySales( ) {
        const res = await this.quoteService.getWeeklyQuotes()
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



    @UseGuards(AuthGuard, RolesGuard)
    @Roles(["admin"])
    @HttpCode(HttpStatus.OK)
    @Put("updatePartnerDetails")
    async updateNameAddr(@Body() body: Record<string, any>, @Req() req: any) {
        const res = await this.adminService.updateAdminDetails(req.user._id, body)
        return res
    }


    @HttpCode(HttpStatus.OK)
    @Get("getAdminDetails")
    async getAdminDetails(@Body() body: Record<string, any>, @Req() req: any) {
        const projectionObj  = {
            password:0
        }
        const res = await this.adminService.getAdminDetails(req.query.id,projectionObj)
        return res
    }



    @UseGuards(AuthGuard, RolesGuard)
    @Roles(["admin"])
    @HttpCode(HttpStatus.OK)
    @Put("updatepartnerpassword")
    async updatePartnerPassword(@Body() body: Record<string, any>, @Req() req: any) {
        const res = await this.adminService.updateAdminPassword(req.user._id, body)
        return res
    }


}
