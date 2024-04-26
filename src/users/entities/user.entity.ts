import { CreateUserDto } from "../dtos/create-user.dto";

export class User {
  id: string;
  name: string;
  email: string;
  password: string;

  constructor(props: CreateUserDto) {
    Object.assign(this, props);
  }
}
