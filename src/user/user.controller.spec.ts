/**
 * https://github.com/jmcdo29/testing-nestjs
 */
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { closeInMongodConnection, rootMongooseTestModule } from '../../test-utils/MongooseTestModule';

import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { LoggerConfig } from '../logger/LoggerConfig';

const logger: LoggerConfig = new LoggerConfig();

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        WinstonModule.forRoot(logger.console()),
      ],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: () => ({
            login: jest.fn(() => true),
            create: jest.fn(() => true),
            pushApplicationIntoUserParticipantList: jest.fn(() => true),
            findAll: jest.fn(() => true),
            findOneById: jest.fn(() => true),
            update: jest.fn(() => true),
            remove: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service: module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('.create()', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });
  });

  describe('.findOne()', () => {
    it('should be defined', () => {
      expect(controller.findOne).toBeDefined();
    });
  });

  describe('.remove()', () => {
    it('should be defined', () => {
      expect(controller.remove).toBeDefined();
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
