import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return token and public user on valid credentials', async () => {
    const user = {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      role: 'user',
      passwordHash: 'hashedPassword',
    };
    usersService.findByEmail.mockResolvedValue(user as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await service.login('test@test.com', 'password');

    expect(usersService.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(service.login('missing@test.com', 'password')).rejects.toThrow(UnauthorizedException);
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    usersService.findByEmail.mockResolvedValue({ passwordHash: 'hashedPassword' } as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('test@test.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
