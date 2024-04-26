import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../entities/user.entity";

export abstract class UsersRepository {
    abstract create(body: CreateUserDto): Promise<User>
    abstract findOneByEmail(email: string): Promise<User>
}