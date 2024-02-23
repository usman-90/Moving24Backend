import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('partner')
@UseGuards(AuthGuard, RolesGuard)
export class PartnerController {
    constructor (private  partnerService : PartnerService){}

    @Roles(["partner"])
    @HttpCode(HttpStatus.OK)
    @Post("insertProof")
    async insertProofs (@Body() body : Record<string , any> , @Req() req: any){
        const res = await this.partnerService.insertPartnerProofs(req.user.email , body)
        return res
    }
}
