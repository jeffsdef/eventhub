import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('UsersRepository', () => {
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.user.create with the given data', async () => {
      const data = {
        name: 'João Silva',
        email: 'joao@email.com',
        passwordHash: 'hash123',
      } as any;
      const created = { id: 1, ...data };
      mockPrisma.user.create.mockResolvedValue(created);

      const result = await repository.create(data);

      expect(mockPrisma.user.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      mockPrisma.user.findMany.mockResolvedValue(users);

      const result = await repository.findAll();

      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return the user when found', async () => {
      const user = { id: 1, name: 'João' };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await repository.findById(1);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(user);
    });

    it('should return null when user is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return the user matching the email', async () => {
      const user = { id: 1, email: 'joao@email.com' };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await repository.findByEmail('joao@email.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'joao@email.com' },
      });
      expect(result).toEqual(user);
    });

    it('should return null when email is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('naoexiste@email.com');

      expect(result).toBeNull();
    });
  });

  describe('findPendingOrganizers', () => {
    it('should return organizers with pendingApproval true', async () => {
      const users = [{ id: 2, role: 'organizer', pendingApproval: true }];
      mockPrisma.user.findMany.mockResolvedValue(users);

      const result = await repository.findPendingOrganizers();

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'organizer', pendingApproval: true },
      });
      expect(result).toEqual(users);
    });
  });

  describe('countAll', () => {
    it('should return the total number of users', async () => {
      mockPrisma.user.count.mockResolvedValue(42);

      const result = await repository.countAll();

      expect(mockPrisma.user.count).toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });

  describe('countOrganizers', () => {
    it('should return the number of organizers', async () => {
      mockPrisma.user.count.mockResolvedValue(5);

      const result = await repository.countOrganizers();

      expect(mockPrisma.user.count).toHaveBeenCalledWith({
        where: { role: 'organizer' },
      });
      expect(result).toBe(5);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updated = { id: 1, name: 'Novo Nome' };
      mockPrisma.user.update.mockResolvedValue(updated);

      const result = await repository.update(1, { name: 'Novo Nome' });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Novo Nome' },
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete and return the user', async () => {
      const user = { id: 1 };
      mockPrisma.user.delete.mockResolvedValue(user);

      const result = await repository.remove(1);

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(user);
    });
  });
});