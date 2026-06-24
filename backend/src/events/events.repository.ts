import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Event } from '@prisma/client';

@Injectable()
export class EventsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({ data });
  }

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany({
      include: { organizer: { select: { name: true } } } 
    });
  }

  async findById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({ 
      where: { id },
      include: { organizer: { select: { name: true } } }
    });
  }
}