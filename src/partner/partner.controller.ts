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
var cron = require('node-cron');
import { PartnerService } from './partner.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { MailerService } from 'src/mailer/mailer.service';

@Controller('partner')
export class PartnerController {
  constructor(private partnerService: PartnerService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['partner'])
  @HttpCode(HttpStatus.OK)
  @Post('insertProof')
  async insertProofs(@Body() body: Record<string, any>, @Req() req: any) {
    const res = await this.partnerService.insertPartnerProofs(
      req.user.email,
      body,
    );
    return res;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['partner'])
  @HttpCode(HttpStatus.OK)
  @Put('updatePartnerDetails')
  async updateNameAddr(@Body() body: Record<string, any>, @Req() req: any) {
    const res = await this.partnerService.updatePartnerDetails(
      req.user._id,
      body,
    );
    return res;
  }

  @HttpCode(HttpStatus.OK)
  @Post('getManyPartnersByEmail')
  async getManyPartners(@Body() body: Record<string, any>, @Req() req: any) {
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
      about: 1,
      ans1: 1,
      ans2: 1,
      ans3: 1,
      EIN: 1,
      images: 1,
      regions: 1,
      profileImage: 1,
    };
    console.log(body);
    const res = await this.partnerService.getManyPartnerByEmail(
      body?.emails,
      projectionObj,
    );
    return res;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['partner'])
  @HttpCode(HttpStatus.OK)
  @Put('updatepartnerpassword')
  async updatePartnerPassword(
    @Body() body: Record<string, any>,
    @Req() req: any,
  ) {
    const res = await this.partnerService.updatePartnerPassword(
      req.user._id,
      body,
    );
    return res;
  }
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(["partner"])
    @HttpCode(HttpStatus.OK)
    @Get("getPartnerProofs")
    async fetchPartnerProofs(@Body() body: Record<string, any>, @Req() req: any) {
        const res = await this.partnerService.getPartnerProofsById(req.user._id)
        console.log(res, "res")
        return res
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(["partner"])
    @HttpCode(HttpStatus.OK)
    @Put("updatePartnerProofs")
    async updatePartnerProofs(@Body() body: Record<string, any>, @Req() req: any) {
        const res = await this.partnerService.updatePartnerProofs(req.user._id,body)
        console.log(res, "res")
        return res
    }


  @HttpCode(HttpStatus.OK)
  @Get('getPartnerOverview')
  async getPartnerOverview(@Query() query: Record<string, any>) {
    let projectionObj = {
      _id: 1,
      email: 1,
      areaPreference: 1,
      companyName: 1,
      location: 1,
      radius: 1,
      regions: 1,
      isVerified: 1,
    };
    const res = await this.partnerService.getPartnerById(
      query?.id,
      projectionObj,
    );
    return res;
  }

  @HttpCode(HttpStatus.OK)
  @Get('getOnePartner')
  async getOnePartnerById(@Query() query: Record<string, any>) {
    console.log(query, 'hereeeeeeeee');
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
      about: 1,
      ans1: 1,
      ans2: 1,
      ans3: 1,
      EIN: 1,
      images: 1,
      regions: 1,
      profileImage: 1,
      isVerified: 1,
    };
    const res = await this.partnerService.getPartnerById(
      query?.id,
      projectionObj,
    );
    return res;
  }

  @HttpCode(HttpStatus.OK)
  @Get('getrecentpartnerreqs')
  async getPartnerRequests(@Query() query: Record<string, any>) {
    console.log(query);
    const res = await this.partnerService.get5PartnerQuotes(query?.email);
    return res;
  }

  @HttpCode(HttpStatus.OK)
  @Get('getpartnerquotes')
  async getParnterQuotes(@Query() query: Record<string, any>) {
    console.log(query);
    const res = this.partnerService.getPartnerQuotes(
      query?.email,
      query?.pageNo,
      query?.fromDate,
      query?.toDate,
      query?.searchQuery,
    );
    return res;
  }

  sendExpirationAlerts() {
//    cron.schedule('* * * * * *', () => {
//      this.partnerService.sendExpirationAlerts();
//    });
  }

}
//const ms = new MailerService()
//const ps = new PartnerService(ms)
//const p = new PartnerController(ps)
//p.runEverySecond()
