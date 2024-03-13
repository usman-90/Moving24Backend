import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { QuotesService } from 'src/quotes/quotes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AdminService } from 'src/admin/admin.service';

@Controller('users')
export class UsersController {
    constructor(private adminService: AdminService, private userService: UsersService, private quoteService: QuotesService) { }



    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @Post("quoteRequest")
    quoteRequest(@Body() body: Record<string, any>, @Req() req: any) {
        let temp: any = {
            movingType: body.movingType,
            moveFrom: body.moveFrom,
            moveTo: body.moveTo,
            currPropertyType: body.currPropertyType,
            currPropertyBedrooms: body.currPropertyBedrooms,
            newPropertyType: body.newPropertyType,
            newPropertyAdditionalInfo: body.newPropertyAdditionalInfo,
            movingDatePref: body.movingDatePref,
            name: body.name,
            email: req.user.email,
            wappNum: body.wappNum,
            minBudgetRange:body?.budgetRange?.minimum ? parseInt(body.budgetRange.minimum) : body?.budgetRange?.minimum,
            maxBudgetRange:body?.budgetRange?.maximum ? parseInt(body.budgetRange.maximum) : body?.budgetRange?.maximum ,
            building: body.building,
            requestTime: new Date()
        }
        if (body.currPropertyType === "appartment") {
            temp.currPropertyFloorNo = body.currPropertyFloorNo,
                temp.hasCurrPropertyLift = body.hasCurrPropertyLift
        }
        if (body.currPropertyType === "appartment") {
            temp.newPropertyFloorNo = body.newPropertyFloorNo,
                temp.hasNewPropertyLift = body.hasNewPropertyLift
        }
        if (body.movingDatePref === "specific") {
            temp.specificTime = body.specificTime
            temp.specificDate = body.specificDate
        } else if (body.movingDatePref === "flexible") {
            temp.startDate = body.startDate
            temp.endDate = body.endDate
        }
        return this.quoteService.postRequest(temp)
    }



    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("getRequests")
    async getUserRequests(@Req() req: any, @Query() query: any) {
        return this.quoteService.getRequestByEmail(req.user.email, query.setNo)
    }


    @HttpCode(HttpStatus.OK)
    @Get("getContactManagerDetails")
    async getAdminDetails(@Body() body: Record<string, any>, @Req() req: any) {
        const projectionObj = {
            contactManagerContactNumber: 1,
            contactManagerName: 1,
        }
        const res = await this.adminService.getAdminDetails(req.query.id,projectionObj)
        return res
    }
}
