import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('organizers/pending')
  findPendingOrganizers() {
    return this.adminService.findPendingOrganizers();
  }

  @Patch('organizers/:id/approve')
  approveOrganizer(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.approveOrganizer(id);
  }

  @Patch('organizers/:id/reject')
  rejectOrganizer(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.rejectOrganizer(id);
  }

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('events/recent')
  getRecentEvents() {
    return this.adminService.getRecentEvents();
  }
}
