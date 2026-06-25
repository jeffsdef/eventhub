import { Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) {}

  findPendingOrganizers() {
    return this.usersService.findPendingOrganizers();
  }

  approveOrganizer(id: number) {
    return this.usersService.approveOrganizer(id);
  }

  rejectOrganizer(id: number) {
    return this.usersService.rejectOrganizer(id);
  }

  async getStats() {
    const [events, totalUsers, totalOrganizers] = await Promise.all([
      this.eventsService.findAll(),
      this.usersService.countAll(),
      this.usersService.countOrganizers(),
    ]);

    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentYear = String(now.getFullYear());
    const eventsThisMonth = events.filter((event: any) =>
      typeof event.date === 'string' && event.date.startsWith(`${currentYear}-${currentMonth}`),
    ).length;

    const averageRating = events.length
      ? events.reduce((sum: number, event: any) => sum + Number(event.rating ?? 0), 0) / events.length
      : 0;

    const totalRevenue = events.reduce((sum: number, event: any) => {
      const confirmed = Number(event.confirmed ?? 0);
      return sum + Number(event.price ?? 0) * confirmed;
    }, 0);

    return {
      totalEvents: events.length,
      totalUsers,
      totalOrganizers,
      eventsThisMonth,
      averageRating,
      totalRevenue: totalRevenue.toFixed(2),
      growthRate: '0%',
    };
  }

  getRecentEvents() {
    return this.eventsService.findRecent();
  }
}
