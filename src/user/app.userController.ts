import { Body, Controller, Get, Post } from "@nestjs/common";
import { database_connection } from "src/db";


@Controller
class User {
    @Post()
    login(@Body body : any){
        
    }


}
