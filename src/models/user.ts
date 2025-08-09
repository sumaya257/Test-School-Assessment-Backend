import { Schema, model, Document } from 'mongoose';

export type Role = 'student' | 'admin' | 'supervisor';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName?: string;
  role: Role;
  verified: boolean;
  currentLevel: string;
  failedStep1: boolean;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: String,
  role: { type: String, enum: ['student', 'admin', 'supervisor'], default: 'student' },
  verified: { type: Boolean, default: false },
  currentLevel: { type: String, default: 'A1' },
  failedStep1: { type: Boolean, default: false }
}, { timestamps: true });

export const UserModel = model<IUser>('User', userSchema);
