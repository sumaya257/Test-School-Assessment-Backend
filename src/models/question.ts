import { Schema, model, Document } from 'mongoose';
export interface IOption { id: number; text: string; isCorrect?: boolean }
export interface IQuestion extends Document {
  competencyCode: string;
  level: string;
  stem: string;
  options: IOption[];
  explanation?: string;
}

const questionSchema = new Schema<IQuestion>({
  competencyCode: { type: String, required: true },
  level: { type: String, required: true },
  stem: { type: String, required: true },
  options: [{ id: Number, text: String, isCorrect: Boolean }],
  explanation: String
}, { timestamps: true });

export const QuestionModel = model<IQuestion>('Question', questionSchema);
