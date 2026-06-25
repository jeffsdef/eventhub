import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Event } from '@prisma/client';

const eventRelations = {
  organizer: { select: { name: true } },
  confirmedUsers: true,
};

@Injectable()
export class EventsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({ data, include: eventRelations });
  }

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany({ include: eventRelations });
  }

  async findFeatured(): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { featured: true },
      include: eventRelations,
    });
  }

  async findRecent(limit = 5): Promise<Event[]> {
    return this.prisma.event.findMany({
      orderBy: { id: 'desc' },
      take: limit,
      include: eventRelations,
    });
  }

  async findById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
      include: eventRelations,
    });
  }

  async findByOrganizerId(organizerId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { organizerId },
      include: eventRelations,
    });
  }

  async findConfirmedByUserId(userId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { confirmedUsers: { some: { id: userId } } },
      include: eventRelations,
    });
  }

  async findPastConfirmedByUserId(userId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        confirmedUsers: { some: { id: userId } },
        status: 'past',
      },
      include: eventRelations,
    });
  }

  async confirmPresence(eventId: number, userId: number): Promise<Event> {
    return this.prisma.event.update({
      where: { id: eventId },
      data: { confirmedUsers: { connect: { id: userId } } },
      include: eventRelations,
    });
  }

  async update(id: number, data: Prisma.EventUpdateInput): Promise<Event> {
    return this.prisma.event.update({
      where: { id },
      data,
      include: eventRelations,
    });
  }

  async remove(id: number): Promise<Event> {
    return this.prisma.event.delete({
      where: { id },
      include: eventRelations,
    });
  }
}