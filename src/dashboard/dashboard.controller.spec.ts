import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { UserService } from '../user/user.service';
import {ApplicationService} from '../application/application.service'
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
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
       { 
          provide: ApplicationService,
          useFactory: () => ({
            create: jest.fn(() => true),
            findAll: jest.fn(() => true),
            findOneById: jest.fn(() => true),
            findAllByOwner: jest.fn(() => true),
            findAllByParticipant: jest.fn(() => true),
            pushUserIntoApplicationParticipantList: jest.fn(() => true),
            findOneByIdAndSecret: jest.fn(() => true),
          })
        }
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service: module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('.showDashboard()', () => {
    it('should be defined', () => {
      expect(controller.showDashboard).toBeDefined();
    });
  });
  describe('.showProfile()',() => {
    it('should be defined',() => {
      expect(controller.showProfile).toBeDefined();
    });
  });
  describe('.showData()',() => {
    it('should be defined',() => {
      expect(controller.showData).toBeDefined();
    });
  });
  describe('.showDev()',() => {
    it('should be defined',() => {
      expect(controller.showDev).toBeDefined();
    });
  });

});
