import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { MailerController } from './mailer.controller';
import { LoggerConfig } from '../logger/LoggerConfig';

const logger: LoggerConfig = new LoggerConfig();

describe('MailerController', () => {
  let controller: MailerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailerController],
      imports: [WinstonModule.forRoot(logger.console())],
    }).compile();

    controller = module.get<MailerController>(MailerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
