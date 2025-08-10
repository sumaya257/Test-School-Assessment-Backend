import { Schema, model, Document, Types } from 'mongoose';

export type Role = 'student' | 'admin' | 'supervisor';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  fullName?: string | undefined;
  role: Role;
  verified: boolean;
  verificationToken?: string | undefined;
  refreshToken?: string | undefined;
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Date | undefined;
  currentLevel: string;
  failedStep1: boolean;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: String,
  role: { type: String, enum: ['student', 'admin', 'supervisor'], default: 'student' },
  verified: { type: Boolean, default: false },
  verificationToken: String,
  refreshToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  currentLevel: { type: String, default: 'A1' },
  failedStep1: { type: Boolean, default: false }
}, { timestamps: true });

export const UserModel = model<IUser>('User', userSchema);
