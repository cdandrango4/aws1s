export interface UserEntity {
  _id: string;
  email: string;
  password: string;
  rol: string;
}

export interface CreateUserInput {
  email: string;
  password: string; // ya hasheada
  rol?: 'admin' | 'user';
}

export interface IAuthRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  createUser(data: CreateUserInput): Promise<UserEntity>;
}
