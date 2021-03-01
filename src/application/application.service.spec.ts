import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from '../user/user.schema';
import { ApplicationService } from './application.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { rootMongooseTestModule } from '../../test-utils/MongooseTestModule';
import * as mongooseUniquevalidator from 'mongoose-unique-validator';
import { Application, ApplicationSchema } from './application.schema';

const mockUser = (mock?: Partial<User>): Partial<UserDocument> => ({
  name: 'some user',
  batch: '19',
  branch: 'BCE',
  personalEmail: 'someone@example.com',
  collegeEmail: 'someoe@edu.in',
});

describe('ApplicationService', () => {
  let testingModule: TestingModule;
  let service: ApplicationService;
  let model: Model<UserDocument>;

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
          {
            name: Application.name,
            useFactory: () => {
              const schema = ApplicationSchema;
              schema.plugin(mongooseUniquevalidator);
              return schema;
            },
          },
        ]),
      ],
      providers: [
        ApplicationService,
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

    service = testingModule.get<ApplicationService>(ApplicationService);
    model = testingModule.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.create()', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });
  });

  describe('.findAll()', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });
  });

  describe('.findOneById()', () => {
    it('should be defined', () => {
      expect(service.findOneById).toBeDefined();
    });
  });

  describe('.findAllByOwner()', () => {
    it('should be defined', () => {
      expect(service.findAllByOwner).toBeDefined();
    });
  });

  describe('.findAllByParticipant()', () => {
    it('should be defined', () => {
      expect(service.findAllByParticipant).toBeDefined();
    });
  });

  describe('.pushUserIntoApplicationParticipantList()', () => {
    it('should be defined', () => {
      expect(service.pushUserIntoApplicationParticipantList).toBeDefined();
    });
  });

  describe('.findOneByIdAndSecret()', () => {
    it('should be defined', () => {
      expect(service.findOneByIdAndSecret).toBeDefined();
    });
  });
});
