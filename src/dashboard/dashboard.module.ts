import { Module, forwardRef } from '@nestjs/common';

import { ApplicationModule } from '../application/application.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UserModule), ApplicationModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardController],
  exports: [DashboardController],
})
export class DashboardModule {}
