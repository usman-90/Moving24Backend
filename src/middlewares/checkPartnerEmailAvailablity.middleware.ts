import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PartnerService } from 'src/partner/partner.service';

@Injectable()
export class CheckPartnerEmailMiddleware implements NestMiddleware {
    constructor(private parnterService: PartnerService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const user = this.parnterService.getPartnerByEmail(email);
        const userRes = await user;
        console.log(userRes)
        if (userRes) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        next();
    }
}

