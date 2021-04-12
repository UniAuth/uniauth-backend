import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import { JwtStrategy } from './stratergy/jwt.stratergy';
import { LocalStrategy } from './stratergy/local.stratergy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { newJWTConstants } from './constants/auth.constants';
import { LoggerConfig } from '../logger/LoggerConfig';

const logger: LoggerConfig = new LoggerConfig();

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: newJWTConstants.secret,
      signOptions: { expiresIn: newJWTConstants.expiresIn },
    }),
    WinstonModule.forRoot(logger.console()),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
