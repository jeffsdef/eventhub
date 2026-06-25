import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

const userStatsInclude = {
  _count: {
    select: {
      eventsCreated: true,
      eventsConfirmed: true,
    },
  },
} as const;

export type UserWithStats = User & {
  _count: {
    eventsCreated: number;
    eventsConfirmed: number;
  };
};

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<UserWithStats> {
    return this.prisma.user.create({
      data,
      include: userStatsInclude,
    });
  }

  async findAll(): Promise<UserWithStats[]> {
    return this.prisma.user.findMany({ include: userStatsInclude });
  }

  async findById(id: number): Promise<UserWithStats | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: userStatsInclude,
    });
  }

  async findPendingOrganizers(): Promise<UserWithStats[]> {
    return this.prisma.user.findMany({
      where: { role: 'organizer', pendingApproval: true },
      include: userStatsInclude,
    });
  }

  async countAll(): Promise<number> {
    return this.prisma.user.count();
  }

  async countOrganizers(): Promise<number> {
    return this.prisma.user.count({ where: { role: 'organizer' } });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<UserWithStats> {
    return this.prisma.user.update({
      where: { id },
      data,
      include: userStatsInclude,
    });
  }

  async remove(id: number): Promise<UserWithStats> {
    return this.prisma.user.delete({
      where: { id },
      include: userStatsInclude,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
