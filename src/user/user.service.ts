import RegistrationNumberWorker from '@vitspot/vit-registration-number';

import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/login.dto';
import { Application } from '../application/application.schema';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

/**
 * **User Service**
 *
 * User Service contains all business logic related to users, and is designed to be
 * imported and re-used in other modules. Therefore it is to ensure that all methods of the service
 * are self-contained and fit to be used directly as per use-case.
 *
 * @category User
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger = new Logger('user'),
  ) {}

  /** funciton to facilitate user login */
  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userModel
      .findOne({ collegeEmail: email })
      .select('_id password name registrationNumber collegeEmail');
    if (user === null) {
      throw new NotFoundException('user not found');
    }

    const hashCheck = await bcrypt.compareSync(password, user.password);
    if (hashCheck === true) {
      return user;
    }

    throw new UnauthorizedException('invalid credentials');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { registrationNumber, name } = createUserDto;
      let { password, collegeEmail } = createUserDto;

      const regNumber = new RegistrationNumberWorker(registrationNumber);
      const branch = regNumber.getBranch();
      const batch = regNumber.getYear();
      password = await bcrypt.hashSync(password, 10);
      collegeEmail = collegeEmail.toLowerCase();

      const user = new this.userModel({ name, collegeEmail, branch, batch, password, registrationNumber });
      await user.save();
      return user;
    } catch (e) {
      throw new ConflictException(e.message);
    }
  }

  async request(requestPasswordResetDto: RequestPasswordResetDto): Promise<User> {
    const { email } = requestPasswordResetDto;

    const user = await this.userModel.findOne({ collegeEmail: email }).select('collegeEmail');
    if (user === null) {
      throw new NotFoundException('user not found');
    } else {
      return user;
    }
  }

  async reset(resetPasswordDto: ResetPasswordDto, isValidToken): Promise<User> {
    let { password_1 } = resetPasswordDto;
    password_1 = await bcrypt.hashSync(password_1, 10);
    const user = await this.userModel.findOneAndUpdate(isValidToken.id, { password: password_1 });
    if (user === null) {
      throw new NotFoundException('user not found');
    } else {
      return user;
    }
  }

  async pushApplicationIntoUserParticipantList(application: Application, user: User) {
    try {
      await this.userModel.findOneAndUpdate(
        { registrationNumber: user.registrationNumber },
        {
          $addToSet: { authorizedApplications: application },
        },
      );
      this.logger.verbose(`Added ${application.name} to ${user.name}`);
    } catch (e) {
      this.logger.verbose(`Error adding ${application.name} to ${user.name}`);
    }
  }

  findAll() {
    return this.userModel.find();
  }

  findOneById(userId: string) {
    return this.userModel.findOne({ _id: userId });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { name, collegeEmail, registrationNumber } = updateUserDto;
    const regNumber = new RegistrationNumberWorker(registrationNumber);
    const branch = regNumber.getBranch();
    const batch = regNumber.getYear();
    const user = await this.findOneById(id);
    if (name) {
      user.name = name;
    }
    if (collegeEmail) {
      user.collegeEmail = collegeEmail;
    }
    if (registrationNumber) {
      user.registrationNumber = registrationNumber;
      (user.branch = branch), (user.batch = batch);
    }
    user.save();

    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
