import { Controller, Get, Query, Req } from "@nestjs/common";
import { Body } from "@nestjs/common";

@Controller("moving24")
export class Moving24Controller {
    @Get("request-form")
    test_request(@Body() request : Body, @Query() query: any ): string{
        console.log(process.env.DATABASE_URL)
        console.log(request)
        console.log(query)
        return "Hello from movving24 handler"
    }
}
