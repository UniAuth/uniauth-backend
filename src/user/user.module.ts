import * as mongooseUniquevalidator from 'mongoose-unique-validator';

import { User, UserSchema } from './user.schema';

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import {DashboardModule} from 'src/dashboard/dashboard.module'
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => DashboardModule),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(mongooseUniquevalidator);
          return schema;
        },
      },
    ])
    
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
