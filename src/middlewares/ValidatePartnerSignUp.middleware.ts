import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateSignUpData implements NestMiddleware {
  constructor() {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req.body, 'middle');
    const { body } = req;
    const temp: any = {
      email: body.email,
      password: body.password,
      removalType: body.removalType,
      areaPreference: body.areaPreference,
      companyName: body.companyName,
      businessType: body.businessType,
      noOfEmployees: body.noOfEmployees,
      telephone: body.telephone,
      addressLine1: body.addressLine1,
      city: body.city,
      state: body.state,
      salutation: body.salutation,
      firstName: body.firstName,
      lastName: body.lastName,
      userName: body.userName,
    };

    if (body.areaPreference === 'region') {
      temp.regions = body.regions;
    } else if (body.areaPreference === 'radius') {
      temp.location = body.location;
      temp.radius = body.radius;
    }
    req.body = temp;

    next();
  }
}
