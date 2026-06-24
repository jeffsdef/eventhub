import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(private eventsRepository: EventsRepository) {}

  create(createEventDto: CreateEventDto, organizerId: number) {
    const { description, ...restData } = createEventDto;
    
    return this.eventsRepository.create({
      ...restData,
      description: description ?? '',
      organizer: { connect: { id: organizerId } },
    });
  }

  findAll() {
    return this.eventsRepository.findAll();
  }

  async findOne(id: number) {
    const event = await this.eventsRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    return event;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}