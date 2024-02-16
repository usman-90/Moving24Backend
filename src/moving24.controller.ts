import { Controller, Get } from "@nestjs/common";

@Controller("moving24")
export class Moving24Controller {
    @Get("request-form")
    test_request(){
        return "Hello from movving24 handler"
    }
}
