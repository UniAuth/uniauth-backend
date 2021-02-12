import { ApplicationModule } from 'src/application/application.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Module,forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule), 
    ApplicationModule],
  controllers: [DashboardController],
  providers: [DashboardService,DashboardController],
  exports : [DashboardController]
})
export class DashboardModule {}
