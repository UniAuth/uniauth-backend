import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.schema';
import { Model } from 'mongoose';
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { AuthService } from './auth.service';
import { rootMongooseTestModule } from '../../test-utils/MongooseTestModule';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { newJWTConstants } from './constants/auth.constants';

/** mocking definitions */
describe('Auth Service', () => {
  let testingModule: TestingModule;
  let service: AuthService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        UserModule,
        JwtModule.register({
          secret: newJWTConstants.secret,
          signOptions: { expiresIn: newJWTConstants.expiresIn },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UserService,
          useFactory: () => ({
            login: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    service = testingModule.get<AuthService>(AuthService);
    model = testingModule.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.validateUser()', () => {
    it('should be defined', () => {
      expect(service.validateUser).toBeDefined();
    });
  });

  describe('.checkLogin()', () => {
    it('should be defined', () => {
      expect(service.checkLogin).toBeDefined();
    });
  });

  describe('.generateJwt()', () => {
    it('should be defined', () => {
      expect(service.generateJwt).toBeDefined();
    });
  });
});
