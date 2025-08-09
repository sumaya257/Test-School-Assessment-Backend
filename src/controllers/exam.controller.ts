import { Request, Response, NextFunction } from 'express';
import { ExamModel } from '../models/Exam';
import { QuestionModel } from '../models/question';
import { UserModel } from '../models/user';


export const startExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { step } = req.body;
    const userId = (req as any).user.sub;

    // Levels per step
    const levelPairs: Record<number, string[]> = {
      1: ['A1', 'A2'],
      2: ['B1', 'B2'],
      3: ['C1', 'C2'],
    };
    const levels = levelPairs[step] || ['A1', 'A2'];

    const questions = await QuestionModel.aggregate([
      { $match: { level: { $in: levels } } },
      { $sample: { size: 44 } },
    ]);

    const exam = await ExamModel.create({
      userId,
      step,
      questions: questions.map((q: any) => ({ questionId: q._id, optionChosen: null })),
      total: questions.length,
      startedAt: new Date(),
    });

    const safeQuestions = questions.map((q: any) => ({
      id: q._id,
      competencyCode: q.competencyCode,
      level: q.level,
      stem: q.stem,
      options: q.options.map((o: any) => ({ id: o.id, text: o.text })),
    }));

    const defaultSeconds = process.env.DEFAULT_SECONDS_PER_QUESTION
      ? parseInt(process.env.DEFAULT_SECONDS_PER_QUESTION)
      : 60;

    res.json({
      examId: exam._id,
      questions: safeQuestions,
      durationSeconds: defaultSeconds * questions.length,
    });
  } catch (err) {
    next(err);
  }
};

export const submitExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;
    const exam = await ExamModel.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let score = 0;
    const questionIds = answers.map((a: any) => a.questionId);
    const questions = await QuestionModel.find({ _id: { $in: questionIds } });

    const qMap: Record<string, any> = {};
    questions.forEach((q: any) => {
      qMap[q._id.toString()] = q;
    });

    answers.forEach((a: any) => {
      const q = qMap[a.questionId];
      if (!q) return;
      const opt = q.options.find((o: any) => o.id === a.optionId);
      if (opt && opt.isCorrect) score++;
    });

    const total = exam.total || answers.length;
    const percentage = (score / total) * 100;

    let certifiedLevel = '';
    let result = 'passed';

    if (exam.step === 1) {
      if (percentage < 25) {
        result = 'failed';
        certifiedLevel = 'none';
        await UserModel.findByIdAndUpdate(exam.userId, { failedStep1: true });
      } else if (percentage < 50) certifiedLevel = 'A1';
      else if (percentage < 75) certifiedLevel = 'A2';
      else certifiedLevel = 'A2'; // proceed to step2 logic on client
    } else if (exam.step === 2) {
      if (percentage < 25) certifiedLevel = 'A2';
      else if (percentage < 50) certifiedLevel = 'B1';
      else if (percentage < 75) certifiedLevel = 'B2';
      else certifiedLevel = 'B2'; // proceed to step3 logic on client
    } else if (exam.step === 3) {
      if (percentage < 25) certifiedLevel = 'B2';
      else if (percentage < 50) certifiedLevel = 'C1';
      else certifiedLevel = 'C2';
    }

    exam.score = score;
    exam.percentage = percentage;
    exam.result = result;
    exam.certifiedLevel = certifiedLevel;
    exam.finishedAt = new Date();
    await exam.save();

    if (certifiedLevel && certifiedLevel !== 'none') {
      await UserModel.findByIdAndUpdate(exam.userId, { currentLevel: certifiedLevel });
    }

    res.json({ score, total, percentage, result, certifiedLevel });
  } catch (err) {
    next(err);
  }
};
