import { Test, TestingModule } from '@nestjs/testing';
import { EventsRepository } from './events.repository';
import { PrismaService } from '../prisma/prisma.service';

const eventRelations = {
  organizer: { select: { name: true } },
  confirmedUsers: true,
};

const mockPrisma = {
  event: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('EventsRepository', () => {
  let repository: EventsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<EventsRepository>(EventsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.event.create with data and relations', async () => {
      const data = {
        title: 'Evento Teste',
        category: 'Tecnologia',
        date: '2026-07-01',
        location: 'São Paulo',
        description: '',
        organizer: { connect: { id: 1 } },
      } as any;
      const created = { id: 1, ...data };
      mockPrisma.event.create.mockResolvedValue(created);

      const result = await repository.create(data);

      expect(mockPrisma.event.create).toHaveBeenCalledWith({
        data,
        include: eventRelations,
      });
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all events with relations', async () => {
      const events = [{ id: 1 }, { id: 2 }];
      mockPrisma.event.findMany.mockResolvedValue(events);

      const result = await repository.findAll();

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        include: eventRelations,
      });
      expect(result).toEqual(events);
    });
  });

  describe('findFeatured', () => {
    it('should return only featured events', async () => {
      const events = [{ id: 1, featured: true }];
      mockPrisma.event.findMany.mockResolvedValue(events);

      const result = await repository.findFeatured();

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: { featured: true },
        include: eventRelations,
      });
      expect(result).toEqual(events);
    });
  });

  describe('findRecent', () => {
    it('should return 5 most recent events by default', async () => {
      const events = [{ id: 5 }, { id: 4 }, { id: 3 }, { id: 2 }, { id: 1 }];
      mockPrisma.event.findMany.mockResolvedValue(events);

      const result = await repository.findRecent();

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'desc' },
        take: 5,
        include: eventRelations,
      });
      expect(result).toEqual(events);
    });

    it('should respect a custom limit', async () => {
      mockPrisma.event.findMany.mockResolvedValue([]);

      await repository.findRecent(3);

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 3 }),
      );
    });
  });

  describe('findById', () => {
    it('should return the event when found', async () => {
      const event = { id: 1, title: 'Evento' };
      mockPrisma.event.findUnique.mockResolvedValue(event);

      const result = await repository.findById(1);

      expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: eventRelations,
      });
      expect(result).toEqual(event);
    });

    it('should return null when not found', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByOrganizerId', () => {
    it('should return events filtered by organizer', async () => {
      const events = [{ id: 1, organizerId: 7 }];
      mockPrisma.event.findMany.mockResolvedValue(events);

      const result = await repository.findByOrganizerId(7);

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: { organizerId: 7 },
        include: eventRelations,
      });
      expect(result).toEqual(events);
    });
  });

  describe('findConfirmedByUserId', () => {
    it('should return events confirmed by the user', async () => {
      const events = [{ id: 2 }];
      mockPrisma.event.findMany.mockResolvedValue(events);

      const result = await repository.findConfirmedByUserId(3);

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: { confirmedUsers: { some: { id: 3 } } },
        include: eventRelations,
      });
      expect(result).toEqual(events);
    });
  });

  describe('findPastConfirmedByUserId', () => {
    it('should return past confirmed events for the user', async () => {
      const events = [{ id: 1, status: 'past' }];
      mockPrisma.event.findMany.mockResolvedValue(events);

      const result = await repository.findPastConfirmedByUserId(3);

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: {
          confirmedUsers: { some: { id: 3 } },
          status: 'past',
        },
        include: eventRelations,
      });
      expect(result).toEqual(events);
    });
  });

  describe('confirmPresence', () => {
    it('should connect the user to the event', async () => {
      const event = { id: 1 };
      mockPrisma.event.update.mockResolvedValue(event);

      const result = await repository.confirmPresence(1, 5);

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { confirmedUsers: { connect: { id: 5 } } },
        include: eventRelations,
      });
      expect(result).toEqual(event);
    });
  });

  describe('update', () => {
    it('should update the event with the given data', async () => {
      const updated = { id: 1, title: 'Novo Título' };
      mockPrisma.event.update.mockResolvedValue(updated);

      const result = await repository.update(1, { title: 'Novo Título' });

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Novo Título' },
        include: eventRelations,
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete the event and return it', async () => {
      const event = { id: 1 };
      mockPrisma.event.delete.mockResolvedValue(event);

      const result = await repository.remove(1);

      expect(mockPrisma.event.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        include: eventRelations,
      });
      expect(result).toEqual(event);
    });
  });
});