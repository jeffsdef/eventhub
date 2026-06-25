import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUserRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findPendingOrganizers: jest.fn(),
    countAll: jest.fn(),
    countOrganizers: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and create user', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
      };
      const expectedUser = {
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: 'hashedPassword',
      };

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      repository.create.mockResolvedValue(expectedUser as any);

      const result = await service.create(createUserDto);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'salt');
      expect(repository.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: 'hashedPassword',
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@test.com' };
      repository.findByEmail.mockResolvedValue(user as any);

      const result = await service.findByEmail('test@test.com');

      expect(repository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, name: 'Test User' }];
      repository.findAll.mockResolvedValue(users as any);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, name: 'Test User' };
      repository.findById.mockResolvedValue(user as any);

      const result = await service.findOne(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });
  });

  it('should return pending organizers', async () => {
    const users = [{ id: 1, role: 'organizer', pendingApproval: true }];
    repository.findPendingOrganizers.mockResolvedValue(users as any);

    await expect(service.findPendingOrganizers()).resolves.toEqual(users);
    expect(repository.findPendingOrganizers).toHaveBeenCalled();
  });

  it('should count users and organizers', async () => {
    repository.countAll.mockResolvedValue(10);
    repository.countOrganizers.mockResolvedValue(3);

    await expect(service.countAll()).resolves.toBe(10);
    await expect(service.countOrganizers()).resolves.toBe(3);
  });

  it('should update user without hashing when password is absent', async () => {
    const user = { id: 1, name: 'Updated' };
    repository.update.mockResolvedValue(user as any);

    await expect(service.update(1, { name: 'Updated' })).resolves.toEqual(user);
    expect(repository.update).toHaveBeenCalledWith(1, { name: 'Updated' });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('should hash password when updating user password', async () => {
    const user = { id: 1, passwordHash: 'newHash' };
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');
    repository.update.mockResolvedValue(user as any);

    await expect(service.update(1, { password: 'newPassword' })).resolves.toEqual(user);
    expect(repository.update).toHaveBeenCalledWith(1, { passwordHash: 'newHash' });
  });

  it('should approve organizer requests', async () => {
    const user = { id: 1, role: 'organizer', pendingApproval: false };
    repository.update.mockResolvedValue(user as any);

    await expect(service.approveOrganizer(1)).resolves.toEqual(user);
    expect(repository.update).toHaveBeenCalledWith(1, {
      role: 'organizer',
      pendingApproval: false,
    });
  });

  it('should reject organizer requests', async () => {
    const user = { id: 1, role: 'user', pendingApproval: false };
    repository.update.mockResolvedValue(user as any);

    await expect(service.rejectOrganizer(1)).resolves.toEqual(user);
    expect(repository.update).toHaveBeenCalledWith(1, {
      role: 'user',
      pendingApproval: false,
    });
  });

  it('should remove a user', async () => {
    const user = { id: 1 };
    repository.remove.mockResolvedValue(user as any);

    await expect(service.remove(1)).resolves.toEqual(user);
    expect(repository.remove).toHaveBeenCalledWith(1);
  });
});