import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserDocument, UserSchema } from '../user/user.schema';
import { rootMongooseTestModule } from '../../test-utils/MongooseTestModule';
import { confirmEmailTokenConstants } from './constants/confirmEmailToken.constants';
import { MailerService } from './mailer.service';
import { UserService } from '../user/user.service';

const mockUser = (mock?: Partial<User>): Partial<UserDocument> => ({
  name: 'some user',
  batch: '19',
  branch: 'BCE',
  personalEmail: 'someone@example.com',
  collegeEmail: 'someoe@edu.in',
});

describe('MailerService', () => {
  let testingModule: TestingModule;
  let service: MailerService;
  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: confirmEmailTokenConstants.secret,
          signOptions: { expiresIn: confirmEmailTokenConstants.expiresIn },
        }),
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
