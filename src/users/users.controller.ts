import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { QuotesService } from 'src/quotes/quotes.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService, private quoteService: QuotesService) { }



    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("quoteRequest")
    quoteRequest(@Body() body: Record <string, any>, @Req() req : any) {
    let temp : any = {
        moveFrom: body.moveFrom,
        moveTo: body.moveTo,
        currPropertyType: body.currentPropertyType,
        currPropertyBedrooms: body.currentPropertyBedrooms,
        newPropertyType: body.newPropertyType,
        newPropertyAdditionalInfo: body.newPropertyAdditionalInfo,
        movingDatePref: body.movingDatePref,
        name: body.name,
        email:req.user.email,
        wappNum: body.wappNum,
        minBudgetRange: body.minbudgetRange,
        maxBudgetRange: body.maxbudgetRange,
        building: body.building,
        requestTime : new Date()
    }
    if (body.currPropertyType === "appartment"){
        temp.currPropertyFloorNo = body.currPropertyFloorNo,
        temp.hasCurrPropertyLift = body.hasCurrPropertyLift
    }
    if (body.currPropertyType === "appartment"){
        temp.newPropertyFloorNo = body.newPropertyFloorNo,
        temp.hasNewPropertyLift = body.hasNewPropertyLift
    }
    if (body.movingDatePref === "specific"){
        temp.specificTime = body.specificTime
        temp.specificDate = body.specificDate
    }else if (body.movingDatePref === "flexible"){
        temp.startDate = body.startDate
        temp.endDate = body.endDate
    }
        return this.quoteService.postRequest(temp)
    }



    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("getRequests")
    async getUserRequests(@Req() req: any , @Query() query : any) {
        return this.quoteService.getRequestByEmail(req.user.email, query.setNo )
    }


}
