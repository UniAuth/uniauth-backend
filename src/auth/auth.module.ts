import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratergy/jwt.stratergy';
import { LocalStrategy } from './stratergy/local.stratergy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { newJWTConstants } from './constants/auth.constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: newJWTConstants.secret,
      signOptions: { expiresIn: newJWTConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
