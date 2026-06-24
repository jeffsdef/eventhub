import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const { password, ...userData } = createUserDto;

    return this.usersRepository.create({
      ...userData,
      passwordHash: hashedPassword,
    });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Utilizador com o ID ${id} não encontrado`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.remove(id);
  }
}