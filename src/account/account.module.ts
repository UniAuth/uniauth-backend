import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ApplicationModule } from 'src/application/application.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserModule } from 'src/user/user.module';
import { accessTokenJwtConstants } from './constants/access_token.constants';

@Module({
  imports: [
    JwtModule.register({
      secret: accessTokenJwtConstants.secret,
      signOptions: { expiresIn: accessTokenJwtConstants.expiresIn },
    }),
    ApplicationModule,
    UserModule,
    AuthModule,
    MailerModule
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
