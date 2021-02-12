import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';

import * as config from 'config';

import * as nodemailer from 'nodemailer';


@Injectable()
export class MailerService {
    private readonly logger = new Logger('mailer');
    constructor(
        private jwtService: JwtService,
    
       
    
        @Inject(AccountService)
        private readonly accountService: AccountService,
        
      ) {}

      async sendEmail (email: string, id: string){
        console.log("entered the fucntion")
        const transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 465,
          secure: true, 
          auth: {
            user: 'apikey', 
            pass: config.get('emailAPI.string'), 
          },
        });
      
    
        const token = await this.accountService.generateAccessToken(id)
        const link = `http://localhost:5000/confirmation/${token}`;
      
        const mailDetails = await transporter.sendMail({
          to: email,
          subject: 'Confirm Email',
          html: `Please click this email to confirm your email: <a href="${link}">${link}</a>`,
        });
      
        
      };
}
