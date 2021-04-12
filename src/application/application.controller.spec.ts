import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { LoggerConfig } from '../logger/LoggerConfig';
import { closeInMongodConnection } from '../../test-utils/MongooseTestModule';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

const logger: LoggerConfig = new LoggerConfig();

describe('ApplicationController', () => {
  let controller: ApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        ApplicationService,
        {
          provide: ApplicationService,
          useFactory: () => ({
            create: jest.fn(() => true),
            findAll: jest.fn(() => true),
            findOneById: jest.fn(() => true),
          }),
        },
      ],
      imports: [WinstonModule.forRoot(logger.console())],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('.create()', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });
  });

  describe('.findAll()', () => {
    it('should be defined', () => {
      expect(controller.findAll).toBeDefined();
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
