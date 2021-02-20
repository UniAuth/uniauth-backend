import * as mongooseUniquevalidator from 'mongoose-unique-validator';

import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './user.schema';

import { Model } from 'mongoose';
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserService } from './user.service';
import { rootMongooseTestModule } from '../../test-utils/MongooseTestModule';

const mockUser = (mock?: Partial<User>): Partial<UserDocument> => ({
  name: 'some user',
  batch: '19',
  branch: 'BCE',
  personalEmail: 'someone@example.com',
  collegeEmail: 'someoe@edu.in',
});

// const mockUser = (mock?: Partial<User>): Partial<UserDocument> => ({
//   name: mock.name || 'some user',
//   batch: mock.batch || '19',
//   branch: mock.branch || 'BCE',
//   personalEmail: mock.personalEmail || 'someone@example.com',
//   collegeEmail: mock.collegeEmail || 'someoe@edu.in',
// });

/** mocking definitions */
describe('User Service', () => {
  let testingModule: TestingModule;
  let service: UserService;
  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeatureAsync([
          {
            name: 'User',
            useFactory: () => {
              const schema = UserSchema;
              schema.plugin(mongooseUniquevalidator);
              return schema;
            },
          },
        ]),
      ],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser()),
            save: jest.fn().mockResolvedValue(mockUser()),
            findOneAndUpdate: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn().mockResolvedValue([mockUser(), mockUser()]),
          },
        },
      ],
    }).compile();

    service = testingModule.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    await expect(service).toBeDefined();
  });

  /** procedure to follow for testing individual service methods */
  describe('.login()', () => {
    it('should be defined', () => {
      expect(service.login).toBeDefined();
    });

    // it('should login user into system', async () => {
    //   console.log(mockModel);
    // });
  });
});
