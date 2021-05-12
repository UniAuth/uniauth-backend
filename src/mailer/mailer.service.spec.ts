import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { JwtModule } from '@nestjs/jwt';
import { User, UserDocument, UserSchema } from '../user/user.schema';

import { MailerService } from './mailer.service';
import { UserService } from '../user/user.service';
import { confirmEmailTokenConstants } from './constants/confirmEmailToken.constants';
import { rootMongooseTestModule } from '../../test-utils/MongooseTestModule';
import { LoggerConfig } from '../logger/LoggerConfig';

const logger: LoggerConfig = new LoggerConfig();

const mockUser = (): Partial<UserDocument> => ({
  name: 'some user',
  batch: '19',
  branch: 'BCE',
  personalEmail: 'someone@example.com',
  collegeEmail: 'someoe@edu.in',
});

describe('MailerService', () => {
  let testingModule: TestingModule;
  let service: MailerService;
  //   let model: Model<UserDocument>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: confirmEmailTokenConstants.secret,
          signOptions: { expiresIn: confirmEmailTokenConstants.expiresIn },
        }),
        WinstonModule.forRoot(logger.console()),
      ],
      providers: [
        MailerService,
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser()),
          },
        },
      ],
    }).compile();

    service = testingModule.get<MailerService>(MailerService);
    // model = testingModule.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.generateJwt()', () => {
    it('should be defined', () => {
      expect(service.generateJwt).toBeDefined();
    });
  });

  describe('.checkVerificationToken()', () => {
    it('should be defined', () => {
      expect(service.checkVerificationToken).toBeDefined();
    });
  });

  describe('.checkPasswordResetToken()', () => {
    it('should be defined', () => {
      expect(service.checkPasswordResetToken).toBeDefined();
    });
  });

  describe('.sendEmail()', () => {
    it('should be defined', () => {
      expect(service.sendEmail).toBeDefined();
    });
  });

  describe('.sendPasswordResetLink()', () => {
    it('should be defined', () => {
      expect(service.sendPasswordResetLink).toBeDefined();
    });
  });
});
