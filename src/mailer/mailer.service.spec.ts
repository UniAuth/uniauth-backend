import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from 'src/user/user.schema';
import { rootMongooseTestModule } from 'test-utils/MongooseTestModule';
import { confirmEmailTokenConstants } from './constants/confirmEmailToken.constants';
import { MailerService } from './mailer.service';

const mockUser = (mock?: Partial<User>): Partial<UserDocument> => ({
  name: mock.name || 'some user',
  batch: mock.batch || '19',
  branch: mock.branch || 'BCE',
  personalEmail: mock.personalEmail || 'someone@example.com',
  collegeEmail: mock.collegeEmail || 'someoe@edu.in',
});

describe('MailerService', () => {
  let testingModule: TestingModule;
  let service: MailerService;
  let model: Model<UserDocument>;


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
      providers: [MailerService,
        {
        provide: getModelToken(User.name),
        useValue: {
          findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser()),
        },
      },],
    }).compile();

    service = testingModule.get<MailerService>(MailerService);
    model = testingModule.get<Model<UserDocument>>(getModelToken(User.name));

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
