import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ApplicationService } from '../application/application.service';
import { UserService } from '../user/user.service';
import { User, UserDocument } from '../user/user.schema';
import { AccountService } from './account.service';
import { JwtModule } from '@nestjs/jwt';
import { accessTokenJwtConstants } from './constants/access_token.constants';
import { rootMongooseTestModule } from '../../test-utils/MongooseTestModule';
import { AccountModule } from './account.module';

describe('AccountService', () => {
  let testingModule: TestingModule;
  let service: AccountService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        JwtModule.register({
          secret: accessTokenJwtConstants.secret,
          signOptions: { expiresIn: accessTokenJwtConstants.expiresIn },
        }),
        AccountModule,
      ],
      providers: [
        AccountService,
        {
          provide: AccountService,
          useFactory: () => ({
            generateAccessToken: jest.fn(() => true),
          }),
        },
        {
          provide: ApplicationService,
          useFactory: () => ({
            findOneById: jest.fn(() => true),
            findOneByIdAndSecret: jest.fn(() => true),
          }),
        },
        {
          provide: UserService,
          useFactory: () => ({
            login: jest.fn(() => true),
            findOneById: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    service = testingModule.get<AccountService>(AccountService);
    model = testingModule.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.validateAccessRequest()', () => {
    it('should be defined', () => {
      expect(service.validateAccessRequest).toBeDefined();
    });
  });

  describe('.generateAccessToken()', () => {
    it('should be defined', () => {
      expect(service.generateAccessToken).toBeDefined();
    });
  });

  describe('.authenticateAndGenerateToken()', () => {
    it('should be defined', () => {
      expect(service.authenticateAndGenerateToken).toBeDefined();
    });
  });

  describe('.provideUserDetailOnAccess()', () => {
    it('should be defined', () => {
      expect(service.provideUserDetailOnAccess).toBeDefined();
    });
  });
});
