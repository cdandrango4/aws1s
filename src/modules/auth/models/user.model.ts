import { Schema, model } from 'mongoose';
import type { Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  password: string;
  rol: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'user'], default: 'user' }
  },
  { timestamps: true, versionKey: false }
);

export const UserModel = model<IUserDocument>('User', userSchema);
