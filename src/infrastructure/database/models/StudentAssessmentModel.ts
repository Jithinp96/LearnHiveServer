import mongoose, { Schema } from "mongoose";
import { IStudentAssessment } from "../../../domain/entities/IAssessment";

const ResponseSchema: Schema = new Schema ({
  questionId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'Question' 
  },
  selectedOption: { 
    type: Number, 
    required: true 
  }
});

const StudentAssessmentSchema: Schema = new Schema({
  studentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  assessmentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Assessment', 
    required: true 
  },
  responses: { 
    type: [ResponseSchema], 
    required: true 
  },
  score: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: ['InProgress', 'Completed'], 
    default: 'InProgress' 
  },
  submittedDate: { 
    type: Date 
  }
}, { timestamps: true });

export const StudentAssessmentModel = mongoose.model<IStudentAssessment>('StudentAssessment', StudentAssessmentSchema);