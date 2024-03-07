import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { RegionsService } from './regions.service';

@Controller('regions')
export class RegionsController {

    constructor(private regionService: RegionsService) { }



    @HttpCode(HttpStatus.OK)
    @Get("allRegions")
    async getAllRegions() {
        return this.regionService.getAllRegions()
    }

    @HttpCode(HttpStatus.OK)
    @Post("fetchPolygon")
    async fetchPolygon(@Body() body : any) {
        console.log("here",body.names)
        return this.regionService.getPolygon(body.names)
    }




}
