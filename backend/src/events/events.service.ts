import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(private eventsRepository: EventsRepository) {}

  async create(createEventDto: CreateEventDto, organizerId: number) {
    const { description, ...restData } = createEventDto;

    const event = await this.eventsRepository.create({
      ...restData,
      description: description ?? '',
      organizer: { connect: { id: organizerId } },
    });

    return this.serializeEvent(event);
  }

  async findAll() {
    const events = await this.eventsRepository.findAll();
    return this.serializeEvents(events);
  }

  async findFeatured() {
    const events = await this.eventsRepository.findFeatured();
    return this.serializeEvents(events);
  }

  async findRecent() {
    const events = await this.eventsRepository.findRecent();
    return this.serializeEvents(events);
  }

  async findByOrganizer(organizerId: number) {
    const events = await this.eventsRepository.findByOrganizerId(organizerId);
    return this.serializeEvents(events);
  }

  async findConfirmedByUser(userId: number) {
    const events = await this.eventsRepository.findConfirmedByUserId(userId);
    return this.serializeEvents(events);
  }

  async findPastConfirmedByUser(userId: number) {
    const events = await this.eventsRepository.findPastConfirmedByUserId(userId);
    return this.serializeEvents(events);
  }

  async findOne(id: number) {
    const event = await this.eventsRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} nao encontrado`);
    }
    return this.serializeEvent(event);
  }

  async confirmPresence(eventId: number, userId: number) {
    await this.findOne(eventId);
    const event = await this.eventsRepository.confirmPresence(eventId, userId);
    return this.serializeEvent(event);
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    await this.findOne(id);
    const event = await this.eventsRepository.update(id, updateEventDto);
    return this.serializeEvent(event);
  }

  async remove(id: number) {
    await this.findOne(id);
    const event = await this.eventsRepository.remove(id);
    return this.serializeEvent(event);
  }

  private serializeEvents(events: any[]) {
    return events.map((event) => this.serializeEvent(event));
  }

  private serializeEvent(event: any) {
    const { confirmedUsers, organizer, ...rest } = event;
    const serialized = { ...rest };

    if ('organizer' in event) {
      serialized.organizer = typeof organizer === 'string' ? organizer : organizer?.name ?? '';
    }

    if ('confirmedUsers' in event) {
      serialized.confirmed = Array.isArray(confirmedUsers) ? confirmedUsers.length : 0;
    }

    return serialized;
  }
}