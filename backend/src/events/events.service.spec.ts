import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventsRepository } from './events.repository';
import { EventsService } from './events.service';

const mockEventsRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findFeatured: jest.fn(),
  findRecent: jest.fn(),
  findById: jest.fn(),
  findByOrganizerId: jest.fn(),
  findConfirmedByUserId: jest.fn(),
  findPastConfirmedByUserId: jest.fn(),
  confirmPresence: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('EventsService', () => {
  let service: EventsService;
  let repository: jest.Mocked<EventsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: EventsRepository,
          useValue: mockEventsRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get(EventsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an event with organizer relation', async () => {
    const dto = {
      title: 'Evento Teste',
      description: 'Descricao',
      category: 'Tecnologia',
      date: '2026-06-24',
      location: 'Lisboa',
    };
    const createdEvent = { id: 1, ...dto, organizerId: 10 };
    repository.create.mockResolvedValue(createdEvent as any);

    const result = await service.create(dto, 10);

    expect(repository.create).toHaveBeenCalledWith({
      ...dto,
      organizer: { connect: { id: 10 } },
    });
    expect(result).toEqual(createdEvent);
  });

  it('should use an empty description when it is omitted', async () => {
    const dto = {
      title: 'Evento Teste',
      category: 'Tecnologia',
      date: '2026-06-24',
      location: 'Lisboa',
    };
    repository.create.mockResolvedValue({ id: 1, ...dto, description: '' } as any);

    await service.create(dto, 10);

    expect(repository.create).toHaveBeenCalledWith({
      ...dto,
      description: '',
      organizer: { connect: { id: 10 } },
    });
  });

  it('should return all events', async () => {
    const events = [{ id: 1, title: 'Evento Teste' }];
    repository.findAll.mockResolvedValue(events as any);

    await expect(service.findAll()).resolves.toEqual(events);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should return featured events', async () => {
    const events = [{ id: 1, featured: true }];
    repository.findFeatured.mockResolvedValue(events as any);

    await expect(service.findFeatured()).resolves.toEqual(events);
    expect(repository.findFeatured).toHaveBeenCalled();
  });

  it('should return recent events', async () => {
    const events = [{ id: 2 }, { id: 1 }];
    repository.findRecent.mockResolvedValue(events as any);

    await expect(service.findRecent()).resolves.toEqual(events);
    expect(repository.findRecent).toHaveBeenCalled();
  });

  it('should return events by organizer', async () => {
    const events = [{ id: 1, organizerId: 7 }];
    repository.findByOrganizerId.mockResolvedValue(events as any);

    await expect(service.findByOrganizer(7)).resolves.toEqual(events);
    expect(repository.findByOrganizerId).toHaveBeenCalledWith(7);
  });

  it('should return confirmed events by user', async () => {
    const events = [{ id: 1 }];
    repository.findConfirmedByUserId.mockResolvedValue(events as any);

    await expect(service.findConfirmedByUser(5)).resolves.toEqual(events);
    expect(repository.findConfirmedByUserId).toHaveBeenCalledWith(5);
  });

  it('should return past confirmed events by user', async () => {
    const events = [{ id: 1, status: 'past' }];
    repository.findPastConfirmedByUserId.mockResolvedValue(events as any);

    await expect(service.findPastConfirmedByUser(5)).resolves.toEqual(events);
    expect(repository.findPastConfirmedByUserId).toHaveBeenCalledWith(5);
  });

  it('should return one event by id', async () => {
    const event = { id: 1, title: 'Evento Teste' };
    repository.findById.mockResolvedValue(event as any);

    await expect(service.findOne(1)).resolves.toEqual(event);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when event does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('should confirm presence after checking the event exists', async () => {
    const event = { id: 1 };
    repository.findById.mockResolvedValue(event as any);
    repository.confirmPresence.mockResolvedValue(event as any);

    await expect(service.confirmPresence(1, 2)).resolves.toEqual(event);
    expect(repository.confirmPresence).toHaveBeenCalledWith(1, 2);
  });

  it('should update an event after checking it exists', async () => {
    const event = { id: 1, title: 'Atualizado' };
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.update.mockResolvedValue(event as any);

    await expect(service.update(1, { title: 'Atualizado' })).resolves.toEqual(event);
    expect(repository.update).toHaveBeenCalledWith(1, { title: 'Atualizado' });
  });

  it('should remove an event after checking it exists', async () => {
    const event = { id: 1 };
    repository.findById.mockResolvedValue(event as any);
    repository.remove.mockResolvedValue(event as any);

    await expect(service.remove(1)).resolves.toEqual(event);
    expect(repository.remove).toHaveBeenCalledWith(1);
  });
});