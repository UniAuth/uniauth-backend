import * as config from 'config';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
/**
 * This is the entry-point of the project, and all modules are summoned here.
 * When adding new functionality, if it does not fall under any of the already
 * defined modules, then new module would be integrated here.
 * @packageDocumentation
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { mongooseConfig } from './config/mongoose.config';
import { DashboardModule } from './dashboard/dashboard.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

/**
 * Main Application Module
 * @category Module
 */
@Module({
  imports: [
    MongooseModule.forRoot(config.get('database.string'), mongooseConfig),
    UserModule,
    ApplicationModule,
    AuthModule,
    AccountModule,
    DashboardModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
            winston.format.colorize(),
          ),
        }),
        new winston.transports.File({ filename: 'application.log' }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
// AccountModule,
