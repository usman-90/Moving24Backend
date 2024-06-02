import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/hashPassword';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { PartnerService } from 'src/partner/partner.service';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private adminService: AdminService,
    private mailerService: MailerService,
    private jwtService: JwtService,
    private partnerService: PartnerService,
  ) {}

  async adminSignIn(password: string, email: string) {
    let projectionObj = {
      email: 1,
      firstName: 1,
      lastName: 1,
      password: 1,
    };
    const user = await this.adminService.getAdminByEmail(email, projectionObj);
    console.log('me chala', user);
    if (!user) {
      throw new NotFoundException();
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException();
    }

    const token = await this.jwtService.signAsync({
      email: user.email,
      _id: user._id.toString(),
      roles: ['admin'],
    });
    delete user.password;
    return {
      ...user,
      token,
      isAdmin: true,
    };
  }

  async adminSignUp(userData: any) {
    const insertedUser = await this.adminService.insertOneAdmin(userData);
    if (!insertedUser) {
      throw new ServiceUnavailableException();
    }
    const token = await this.jwtService.signAsync({
      email: userData?.email,
      _id: insertedUser?.insertedId.toString(),
      roles: ['admin'],
    });

    return {
      email: userData.email,
      _id: insertedUser?.insertedId.toString(),
      token,
      isAdmin: true,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };
  }

  async signIn(password: string, email: string) {
    let projectionObj = {
      email: 1,
      firstName: 1,
      lastName: 1,
      proof: 1,
      password: 1,
    };
    const user = await this.partnerService.getPartnerByEmail(
      email,
      projectionObj,
    );
    console.log('me chala', user);
    if (!user) {
      throw new NotFoundException();
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException();
    }

    const token = await this.jwtService.signAsync({
      email: user.email,
      _id: user._id.toString(),
      roles: ['partner'],
    });
    delete user.password;
    if (Object.keys(user?.proof)?.length) {
      user.proof = true;
    } else {
      user.proof = false;
    }
    return {
      ...user,
      token,
      isPartner: true,
    };
  }

  async partnerSignUp(userData: any) {
    const insertedUser = await this.partnerService.insertOnePartner(userData);
    if (!insertedUser) {
      throw new ServiceUnavailableException();
    }
    const token = await this.jwtService.signAsync({
      email: userData.email,
      _id: insertedUser?.insertedId.toString(),
      roles: ['partner'],
    });

    return {
      email: userData.email,
      _id: insertedUser?.insertedId.toString(),
      token,
      isPartner: true,
      firstName: userData.firstName,
      lastName: userData.lastName,
      proof: false,
    };
  }

  async sendVerificationEmailToUser(email: string, code: string) {
    await this.mailerService.sendMain({
      subject: 'Moving 24 Verification',
      text: 'Your verification code is ' + code,
      to: email,
      from: process.env.EMAIL,
    });

    const user = await this.userService.findOneUserByEmail(email);
    if (user) {
      await this.userService.updateUserCodeByEmail(email, code);
    } else {
      await this.userService.insertOneCustomer(email, code);
    }

    return true;
  }

  async verifyCode(email: string, code: string) {
    const user = await this.userService.getUserCode(email);
    if (user.code === code) {
      const res = await this.userService.setVerifiedTrue(email);
      const token = await this.jwtService.signAsync({
        email: user?.email,
        _id: user?._id?.toString(),
        roles: ['user'],
      });
      return {
        user: {
          ...user,
          token,
        },
        res,
        verified: true,
      };
    } else {
      throw new BadRequestException({
        message: 'wrong code',
      });
    }
  }
}
