import { Schema, model, Document } from 'mongoose';
export interface IExam extends Document {
  userId: any;
  step: number;
  questions: { questionId:any; optionChosen: number | null }[];
  score?: number;
  total?: number;
  percentage?: number;
  result?: string;
  certifiedLevel?: string;
  startedAt?: Date;
  finishedAt?: Date;
  durationSeconds?: number;
  autoSubmitted?: boolean;
}
const examSchema = new Schema<IExam>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  step: { type: Number, required: true },
  questions: [{ questionId: Schema.Types.ObjectId, optionChosen: Number }],
  score: Number,
  total: Number,
  percentage: Number,
  result: String,
  certifiedLevel: String,
  startedAt: Date,
  finishedAt: Date,
  durationSeconds: Number,
  autoSubmitted: { type: Boolean, default: false }
}, { timestamps: true });

export const ExamModel = model<IExam>('Exam', examSchema);
