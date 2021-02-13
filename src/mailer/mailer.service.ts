import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import * as nodemailer from 'nodemailer';
import { JwtService, } from '@nestjs/jwt';
import { Model, ObjectId } from 'mongoose';
import { confirmEmailTokenConstants } from './constants/confirmEmailToken.constants';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailerService {
  private readonly logger = new Logger('mailer');
  constructor( @InjectModel(User.name) private  userModel: Model<UserDocument>,private jwtService: JwtService,
  @Inject(UserService)
    private readonly userService: UserService,
   ) {}

  /**
   * @Todo : remove duplicate code from account.service.ts for jwt
   */
  async generateJwt(jwtData: { email: string }): Promise<string> {
    const token = await this.jwtService.signAsync(jwtData, confirmEmailTokenConstants);
    return token;
  }

  async verifyJwt(token: string) {
    try {
      const isValidToken = await this.jwtService.verifyAsync(token, confirmEmailTokenConstants);
      this.logger.verbose(isValidToken)
      this.updateVerifiedStatus(isValidToken)
       return isValidToken;
    } catch (e) {
      throw new UnauthorizedException(`invalid access`);
    }
  }

  async updateVerifiedStatus(isValidToken){
    try {
     
      const update = await this.userModel.findByIdAndUpdate(isValidToken.id,{verified: true})
    } catch (e) {
      throw Error(`Not found`);
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

    const mailDetails = await transporter.sendMail({
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
    const link = `http://localhost:5000/account/register/verify/${token}`;

    const mailDetails = await transporter.sendMail({
      from: 'ultimateraze011@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<b>Hello world?</b> <a href="${link}">confirm Email</a>`, // html body
    });
  }
}
