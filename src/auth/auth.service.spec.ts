import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { newJWTConstants } from './constants/auth.constants';
import { rootMongooseTestModule } from '../../test-utils/MongooseTestModule';
import { LoggerConfig } from '../logger/LoggerConfig';

const logger: LoggerConfig = new LoggerConfig();

/** mocking definitions */
describe('Auth Service', () => {
  let testingModule: TestingModule;
  let service: AuthService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        UserModule,
        JwtModule.register({
          secret: newJWTConstants.secret,
          signOptions: { expiresIn: newJWTConstants.expiresIn },
        }),
        WinstonModule.forRoot(logger.console()),
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
    // model = testingModule.get<Model<UserDocument>>(getModelToken(User.name));
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
