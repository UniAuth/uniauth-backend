import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { newJWTConstants } from '../constants/auth.constants';

@Injectable()
export class CookieStratergy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: newJWTConstants.secret,
    });
  }

  async validate(payload: { id: any }) {
    return this.userService.findOneById(payload.id);
  }
}
