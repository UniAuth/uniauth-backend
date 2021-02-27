import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { IncomingAuthDto, IncomingAuthLoginDto } from './dto/incoming-auth.dto';
import { AccountService } from './account.service';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDtoWithCaptcha } from '../user/dto/create-user.dto';
import { ApplicationService } from '../application/application.service';
import { AccessUserDetailsDto } from './dto/access-user-details.dto';
import { MailerService } from '../mailer/mailer.service';
import { findConfigFile } from 'typescript';
import { RequestPasswordResetDto } from '../user/dto/request-password-reset.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger('account');

  constructor(
    private readonly accountService: AccountService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ApplicationService) private readonly applicationService: ApplicationService,
    @Inject(MailerService) private readonly mailerService: MailerService,
  ) {}

  /**
   * OAUTH FLOW HANDLERS :: Displayed only when invoded mid-way auth flow
   */

  /**
   * to display login form on client-initiated-auth
   */
  @Get('o/login')
  @UsePipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  )
  async showLoginPageAsAuth(@Res() res: Response, @Query() incomingAuthDto: IncomingAuthDto) {
    const { client_id } = incomingAuthDto;
    try {
      const applicationDetails = await this.accountService.validateAccessRequest(incomingAuthDto);
      return res.render('account/o/login', { app: applicationDetails });
    } catch (e) {
      this.logger.error(`${e.message} for ${client_id}`);
      return res.render('error', e.response);
    }
  }

  /**
   * To handle login form submission on client-initiated-auth
   */
  @Post('o/login')
  @UsePipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  )
  async processLoginPageAsAuth(@Res() res: Response, @Body() incomingAuthDto: IncomingAuthLoginDto) {
    const { client_id } = incomingAuthDto;

    /**
     * validate and get application details from incoming dto
     */
    try {
      const applicationDetails = await this.accountService.validateAccessRequest(incomingAuthDto);

      /**
       * ensure authentication for users
       */
      try {
        const { token, user } = await this.accountService.authenticateAndGenerateToken(incomingAuthDto);

        /** push user into application participant list set */
        this.applicationService.pushUserIntoApplicationParticipantList(applicationDetails, user);
        this.userService.pushApplicationIntoUserParticipantList(applicationDetails, user);
        res.redirect(`${incomingAuthDto.redirect_uri}/?access_token=${token}`);
      } catch (e) {
        /**
         * Render login page with error message from server
         */
        this.logger.error(`${e.message} for ${client_id}`);
        return res.render('account/o/login', { app: applicationDetails, server: { message: e.message } });
      }
    } catch (e) {
      /**
       * Render error page with validation error mesage
       */
      this.logger.error(`POST ${e.message} for ${client_id}`);
      return res.render('error', e.response);
    }
  }

  @Post('o/access')
  @UsePipes(ValidationPipe)
  async shareUserDetailsViaAuth(@Body() accessUserDetailsDto: AccessUserDetailsDto) {
    return this.accountService.provideUserDetailOnAccess(accessUserDetailsDto);
  }

  /**
   * NON OAUTH FLOW HANDLERS :: Normal Operations
   */
  /**
   * to display login page
   */
  @Get('login')
  @UsePipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  )
  async showLoginPage(@Res() res: Response) {
    try {
      return res.render('account/login');
    } catch (e) {
      return res.render('error', e.response);
    }
  }

  /**
   * to logout user from module
   */
  @Get('logout')
  async logoutUser(@Res() res: Response) {
    try {
      res.cookie('vitAuth', '');
      res.redirect('./../');
    } catch (e) {
      return res.render('error', e.response);
    }
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async processLoginPage(@Res() res: Response, @Body() loginDto: LoginDto) {
    try {
      const user = await this.userService.login(loginDto);
      const jwtData = { id: user._id, email: user.collegeEmail };
      const cookieData = await this.authService.generateJwt(jwtData);
      res.cookie('vitAuth', cookieData);
      //   res.render('profile/homepage', user);
      res.redirect('./../dashboard');
    } catch (e) {
      return res.render('account/login', { server: { message: e.message } });
    }
  }

  /**
   * To show reset password page
   */
  @Get('/password/request')
  async showPasswordRequestPage(@Res() res: Response) {
    try {
      return res.render('password/request');
    } catch (e) {
      return res.render('error', e.response);
    }
  }

  @Post('/password/request')
  @UsePipes(ValidationPipe)
  async processRequestPage(@Res() res: Response, @Body() requestPasswordResetDto: RequestPasswordResetDto) {
    try {
      const response = await this.userService.request(requestPasswordResetDto);
      const templateData = {
        server: {
          message: 'Please check your email for password reset link',
        },
        flag: 0,
      };
      this.mailerService.sendPasswordResetLink(response.collegeEmail);
      return res.render('partials/server-response', { templateData });
    } catch (e) {
      const templateData = {
        server: e.response,
      };
      return res.render('partials/server-response', { templateData });
    }
  }

  @Get('/password/reset/:token')
  async showPasswordResetPage(@Res() res: Response, @Param('token') token: string) {
    try {
      this.mailerService.checkPasswordResetToken(token);
      return res.render('password/reset');
    } catch (e) {
      return res.render('error', e.response);
    }
  }

  @Post('/password/reset/:token')
  async processResetPage(
    @Res() res: Response,
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    try {
      const isValidToken = await this.mailerService.checkPasswordResetToken(token);
      const response = await this.userService.reset(resetPasswordDto, isValidToken);
      const templateData = {
        server: {
          message: 'Password changed successfully',
        },
        flag: 1,
      };
      return res.render('partials/server-response', { templateData });
    } catch (e) {
      const templateData = {
        server: e.response,
      };
      return res.render('partials/server-response', { templateData });
    }
  }

  /**
   * Pages to register a new user into the system
   */
  @Get('/register')
  async showRegisterPage(@Res() res: Response) {
    try {
      return res.render('account/register');
    } catch (e) {
      return res.render('error', e.response);
    }
  }

  /**
   * Page to receive verification callback from email
   */
  @Get('/register/verify/:token')
  async showRegisterSuccessPage(@Res() res: Response, @Param('token') token: string) {
    try {
      this.mailerService.checkVerificationToken(token);
      const templateData = {
        server: {
          message: 'Your account has been verified',
        },
        flag: 1,
      };
      return res.render('partials/server-response', { templateData });
    } catch (e) {
      return res.render('error', e.response);
    }
  }

  @Post('/register')
  @UsePipes(ValidationPipe)
  async processRegisterPage(@Res() res: Response, @Body() createUserDtoWithCaptcha: CreateUserDtoWithCaptcha) {
    try {
      const response = await this.userService.create(createUserDtoWithCaptcha);
      const templateData = {
        server: {
          message: 'Please check your email for verification link',
        },
        flag: 0,
      };
      this.mailerService.sendEmail(response.collegeEmail);
      return res.render('partials/server-response', { templateData });
    } catch (e) {
      const templateData = {
        server: e.response,
      };
      return res.render('partials/server-response', { templateData });
    }
  }
}
