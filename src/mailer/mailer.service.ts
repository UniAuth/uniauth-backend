import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { confirmEmailTokenConstants } from './constants/confirmEmailToken.constants';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class MailerService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger = new Logger('mailer'),
  ) {}

  /**
   * @Todo : remove duplicate code from account.service.ts for jwt
   */
  async generateJwt(jwtData: { email: string }): Promise<string> {
    const token = await this.jwtService.signAsync(jwtData, confirmEmailTokenConstants);
    return token;
  }

  /**
   * Fuction to verify a user by jwt mechanism
   * @param token string | JWT token sent to user in email, received as url param
   */
  async checkVerificationToken(token: string) {
    try {
      this.logger.verbose(`Token received ${token}`);
      const isValidToken = await this.jwtService.verifyAsync(token, confirmEmailTokenConstants);
      this.logger.verbose(`IsValidToken=${isValidToken}`);
      const updatedUser = await this.userModel.findByIdAndUpdate(isValidToken.id, { verified: true });
      this.logger.verbose(`Updated User`, JSON.stringify(updatedUser));
      return isValidToken;
    } catch (e) {
      throw new UnauthorizedException(`invalid access`);
    }
  }

  async checkPasswordResetToken(token: string) {
    try {
      this.logger.verbose(`Token received ${token}`);
      const isValidToken = await this.jwtService.verifyAsync(token, confirmEmailTokenConstants);
      this.logger.verbose(`IsValidToken=${isValidToken}`);
      return isValidToken;
    } catch (e) {
      throw new UnauthorizedException(`invalid access`);
    }
  }

  async sendEmail(email: string) {
    const transporter = nodemailer.createTransport({
      host: config.get('nodemailer_config.host'),
      port: config.get('nodemailer_config.port'),
      secure: config.get('nodemailer_config.secure'),
      auth: {
        user: config.get('nodemailer_config.auth.user'),
        pass: config.get('nodemailer_config.auth.pass'),
      },
    });

    const token = await this.generateJwt({ email });
    const link = `http://localhost:5000/account/register/verify/${token}`;

    await transporter.sendMail({
      from: 'ultimateraze011@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: `<b>Hello world?</b> <a href="${link}">confirm Email</a>`, // html body
    });
  }

  async sendPasswordResetLink(email: string) {
    const transporter = nodemailer.createTransport({
      host: config.get('nodemailer_config.host'),
      port: config.get('nodemailer_config.port'),
      secure: config.get('nodemailer_config.secure'),
      auth: {
        user: config.get('nodemailer_config.auth.user'),
        pass: config.get('nodemailer_config.auth.pass'),
      },
    });

    const token = await this.generateJwt({ email });
    const link = `http://localhost:5000/account/password/reset/${token}`;

    await transporter.sendMail({
      from: 'ultimateraze011@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: `<b>Hello world?</b> <a href="${link}">confirm Email</a>`, // html body
    });
  }
}
