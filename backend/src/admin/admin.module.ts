import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [EventsModule, UsersModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
