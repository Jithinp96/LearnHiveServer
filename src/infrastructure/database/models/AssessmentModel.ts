import mongoose, { Schema, Document } from 'mongoose';
import { IAssessment } from '../../../domain/entities/IAssessment';

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
  marks: { type: Number, required: true }
});

const AssessmentSchema = new Schema({
  courseId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Course',
    required: true 
  },
  tutorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Tutor',
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  passingScore: { type: Number, required: true },
  questions: [QuestionSchema]
}, { timestamps: true });

export const Assessment = mongoose.model<IAssessment & Document>('Assessment', AssessmentSchema);