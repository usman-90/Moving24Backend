import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class CheckEmailMiddleware implements NestMiddleware {
    constructor(private userService: UsersService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const user = this.userService.findOneUserByEmail(email);
        const userRes = await user;
        if (userRes) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        next();
    }
}

