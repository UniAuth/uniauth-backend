import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { MongoExceptionFilter } from '../auxiliary/exceptions/mongo.exceptions';
// import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';

/**
 * **User Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category User
 */
@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
}
