import { Injectable } from '@nestjs/common';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';

@Injectable()
export class DashboardService {

  findAll() {
    return `This action returns all dashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }


  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
