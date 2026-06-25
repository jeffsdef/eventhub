import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithStats, UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const { password, ...userData } = createUserDto;

    const user = await this.usersRepository.create({
      ...userData,
      passwordHash: hashedPassword,
    });

    return this.serializeUser(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findAll() {
    return this.usersRepository.findAll().then((users) => users.map((user) => this.serializeUser(user)));
  }

  findPendingOrganizers() {
    return this.usersRepository
      .findPendingOrganizers()
      .then((users) => users.map((user) => this.serializeUser(user)));
  }

  countAll() {
    return this.usersRepository.countAll();
  }

  countOrganizers() {
    return this.usersRepository.countOrganizers();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Utilizador com o ID ${id} nao encontrado`);
    }
    return this.serializeUser(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;

    const user = password
      ? await this.usersRepository.update(id, {
          ...userData,
          passwordHash: await bcrypt.hash(password, await bcrypt.genSalt()),
        })
      : await this.usersRepository.update(id, userData);

    return this.serializeUser(user);
  }

  async approveOrganizer(id: number) {
    const user = await this.usersRepository.update(id, {
      role: 'organizer',
      pendingApproval: false,
    });
    return this.serializeUser(user);
  }

  async rejectOrganizer(id: number) {
    const user = await this.usersRepository.update(id, {
      role: 'user',
      pendingApproval: false,
    });
    return this.serializeUser(user);
  }

  remove(id: number) {
    return this.usersRepository.remove(id).then((user) => this.serializeUser(user));
  }

  serializeUser(user: UserWithStats) {
    const { passwordHash, _count, pendingApproval, ...rest } = user;

    return {
      ...rest,
      avatar: rest.avatar ?? '',
      bio: rest.bio ?? '',
      eventsCreated: _count?.eventsCreated ?? 0,
      eventsAttended: _count?.eventsConfirmed ?? 0,
    };
  }
}
