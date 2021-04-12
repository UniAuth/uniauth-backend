import { BadRequestException, Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { ApplicationService } from '../application/application.service';
import { JwtService } from '@nestjs/jwt';
import { accessTokenJwtConstants } from './constants/access_token.constants';
import { IncomingAuthDto, IncomingAuthLoginDto } from './dto/incoming-auth.dto';
import { Injectable } from '@nestjs/common';
import { Application } from '../application/application.schema';
import { scopeMapper } from './minions/scopeMapper.minion';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { AccessUserDetailsDto } from './dto/access-user-details.dto';
import { AuthService } from '../auth/auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AccountService {
  /**
   * Initialize account services
   */
  constructor(
    private jwtService: JwtService,

    @Inject(ApplicationService)
    private readonly applicationService: ApplicationService,

    @Inject(UserService)
    private readonly userService: UserService,

    @Inject(AuthService)
    private readonly authService: AuthService,

    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger = new Logger('accounts'),
  ) {}

  /**
   * To validate request from application whether to show signIn form or not
   */
  async validateAccessRequest(incomingAuthDto: IncomingAuthDto): Promise<Application> {
    const { client_id, redirect_uri } = incomingAuthDto;

    /** check if given client exists, validate params */
    const details = await this.applicationService.findOneById(client_id);
    if (details === null) {
      throw new BadRequestException('unknown application');
    }

    /** check if redirect URI is one of the authorized URIs */
    if (!details.authorizedRedirect.includes(redirect_uri)) {
      throw new BadRequestException('invalid redirected uri');
    }

    details.scope = details.scope.map((givenScope) => scopeMapper(givenScope));

    return details;
  }

  /**
   * To generate a new jwt containing access token
   */
  async generateAccessToken(id: string) {
    /** now generate a new access token  */
    const tokenPayload = { token: String(id) };
    const token = await this.jwtService.signAsync(tokenPayload, accessTokenJwtConstants);
    return token;
  }

  /**
   * Service to a user into servers
   */
  async authenticateAndGenerateToken(incomingAuthDto: IncomingAuthLoginDto): Promise<{ token: string; user: User }> {
    /** check username and password */
    const { email, password } = incomingAuthDto;
    const loggedInUser = await this.userService.login({ email, password });
    this.logger.verbose(`Access granted by ${loggedInUser?.name}`);

    /** generate access token */
    const accessToken = await this.generateAccessToken(loggedInUser?._id);
    return { token: accessToken, user: loggedInUser };
  }

  /**
   * Function to provide response and data via oauth flow
   */
  async provideUserDetailOnAccess(accessUserDetailsDto: AccessUserDetailsDto) {
    try {
      const { clientId, clientSecret, accessToken } = accessUserDetailsDto;
      /** ensure that application exists */
      const applicationDetails = await this.applicationService.findOneByIdAndSecret(clientId, clientSecret);

      /** ensure that access_token is valid */
      const { token } = await this.jwtService.verifyAsync(accessToken, accessTokenJwtConstants);

      /** get user details by id */
      const userDetails = await this.userService.findOneById(token);
      const userDetailsJson = userDetails.toJSON();

      const resultantSet = {};
      /** map details as per application scope */
      this.logger.verbose(`Application Scope: ${JSON.stringify(applicationDetails.scope)}`);
      Object.keys(userDetailsJson).forEach((key) => {
        if (applicationDetails.scope.includes(key)) {
          resultantSet[key] = userDetailsJson[key];
        }
      });
      this.logger.verbose(`Sharing details of ${userDetailsJson.name}, ${JSON.stringify(resultantSet)}`);
      return resultantSet;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
