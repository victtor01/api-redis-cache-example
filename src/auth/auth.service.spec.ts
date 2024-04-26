import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

// Mocks
jest.mock('../users/users.service');
jest.mock('bcryptjs');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userMock: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    userMock = new User({
      name: 'example',
      email: 'test@example.com',
      password: 'test',
    });
  });

  it('to be defined', () => {
    expect(usersService).toBeDefined();
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  /**
   * Description: Test suite for login method.
   */
  describe('login', () => {
    it('should success login', async () => {
      // Destructure email and password from userMock
      const { email, password } = userMock,
        data = { email, password };

      // Mock successful response from UsersService and JwtService
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue({ ...userMock });

      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('access_token');

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('refresh_token');

      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('session');

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => {
        return true;
      });

      const responseMock = {
        cookie: jest.fn(),
      } as unknown as Response;

      // Call the method being tested
      const res = await authService.auth(data, responseMock);

      // Expectations
      expect(res).toBeDefined();
      expect(res.access_token).toEqual('access_token');
      expect(res.refresh_token).toEqual('refresh_token');
    });

    it('should error because incorrect password', async () => {
      // Destructure email from userMock
      const email = userMock.email;

      const dto = {
        // email exists
        email,
        // incorrect password
        password: 'incorrect',
      };

      // Mock response from UsersService
      jest.spyOn(usersService, "findOneByEmail").mockResolvedValueOnce(userMock);

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => {
        return false;
      });

      const responseMock = {
        cookie: jest.fn(),
      } as unknown as Response;

      // Expectations
      expect(authService.auth(dto, responseMock)).rejects.toThrow(
        new UnauthorizedException('incorrect password'),
      );
    });
  });
});
