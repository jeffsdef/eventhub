import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let usersService: jest.Mocked<UsersService>;
  let eventsService: jest.Mocked<EventsService>;

  const mockUsersService = {
    findPendingOrganizers: jest.fn(),
    approveOrganizer: jest.fn(),
    rejectOrganizer: jest.fn(),
    countAll: jest.fn(),
    countOrganizers: jest.fn(),
  };

  const mockEventsService = {
    findAll: jest.fn(),
    findRecent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compile();

    service = module.get(AdminService);
    usersService = module.get(UsersService);
    eventsService = module.get(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return pending organizers', async () => {
    const users = [{ id: 1 }];
    usersService.findPendingOrganizers.mockResolvedValue(users as any);

    await expect(service.findPendingOrganizers()).resolves.toEqual(users);
  });

  it('should approve and reject organizer requests', async () => {
    usersService.approveOrganizer.mockResolvedValue({ id: 1, role: 'organizer' } as any);
    usersService.rejectOrganizer.mockResolvedValue({ id: 2, role: 'user' } as any);

    await expect(service.approveOrganizer(1)).resolves.toEqual({ id: 1, role: 'organizer' });
    await expect(service.rejectOrganizer(2)).resolves.toEqual({ id: 2, role: 'user' });
  });

  it('should calculate platform stats', async () => {
    eventsService.findAll.mockResolvedValue([
      { id: 1, date: '2026-06-10', rating: 4, price: 10, confirmedUsers: [{ id: 1 }, { id: 2 }] },
      { id: 2, date: '2026-05-10', rating: 2, price: 5, confirmedUsers: [] },
    ] as any);
    usersService.countAll.mockResolvedValue(20);
    usersService.countOrganizers.mockResolvedValue(4);

    const stats = await service.getStats();

    expect(stats.totalEvents).toBe(2);
    expect(stats.totalUsers).toBe(20);
    expect(stats.totalOrganizers).toBe(4);
    expect(stats.averageRating).toBe(3);
    expect(stats.totalRevenue).toBe('20.00');
  });

  it('should return recent events', async () => {
    const events = [{ id: 2 }, { id: 1 }];
    eventsService.findRecent.mockResolvedValue(events as any);

    await expect(service.getRecentEvents()).resolves.toEqual(events);
  });
});