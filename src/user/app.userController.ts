import { Body, Controller, Get, Post } from "@nestjs/common";
import { database_connection } from "src/db";


@Controller("auth")
class User {
    @Post("login")
    async login(@Body() body : Body){
        const {email , password} = body;
        const collections = await database_connection(["User"])
        if (!collections){
            return
        }
        const userCollection = collections[0]
        const result = await userCollection.findOne({})

    }



}
