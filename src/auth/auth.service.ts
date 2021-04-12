import { JwtService } from '@nestjs/jwt';
import { Body, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { newJWTConstants } from './constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { ObjectId } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  /** initialize a logger with auth context */

  constructor(
    private jwtService: JwtService,

    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger = new Logger('auth'),
  ) {}

  /** check if given user is registered into database */
  async validateUser(token: string): Promise<any> {
    try {
      const isValidToken = await this.jwtService.verifyAsync(token, newJWTConstants);
      return isValidToken;
    } catch (e) {
      throw new UnauthorizedException(`invalid access`);
    }
  }

  /**
   * method to login into server with email and password
   */
  async checkLogin(@Body() loginDto: LoginDto) {
    const user = await this.userService.login(loginDto);
    if (!user) {
      throw new UnauthorizedException(`Invalid Credentials`);
    }

    const jwtData = { id: user._id, email: user.collegeEmail };
    const token = await this.jwtService.signAsync(jwtData, newJWTConstants);
    return token;
  }

  async generateJwt(jwtData: { id: ObjectId; email: string }): Promise<string> {
    const token = await this.jwtService.signAsync(jwtData, newJWTConstants);
    return token;
  }
}
