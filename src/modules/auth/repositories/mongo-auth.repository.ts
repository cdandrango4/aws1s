import type { IAuthRepository, UserEntity, CreateUserInput } from './auth.repository.interface';
import { UserModel } from '../models/user.model';
import type { IUserDocument } from '../models/user.model';

export class MongoAuthRepository implements IAuthRepository {
  private toEntity(doc: IUserDocument): UserEntity {
    return {
      _id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      rol: doc.rol
    };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async createUser(data: CreateUserInput): Promise<UserEntity> {
    const doc = await new UserModel(data).save();
    return this.toEntity(doc);
  }
}
