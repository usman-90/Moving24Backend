import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('quotes')
export class QuotesController {
  constructor(private quoteService: QuotesService ){}   
    
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


}
