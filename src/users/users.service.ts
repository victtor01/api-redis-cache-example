import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users-repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  private salts = 10;

  async create(body: CreateUserDto): Promise<User> {
    // bcrypt password
    body.password = await hash(body.password, this.salts);

    return this.usersRepo.create(body);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepo.findOneByEmail(email);
  }
}
