import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardService],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
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
  describe('.findOne()', () => {
    it('should be defined', () => {
      expect(service.findOne).toBeDefined();
    });
  });
  describe('.update()', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });
  });
  describe('.remove()', () => {
    it('should be defined', () => {
      expect(service.remove).toBeDefined();
    });
  });

});
