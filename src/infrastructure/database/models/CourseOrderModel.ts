import mongoose, { Schema, Document } from "mongoose";

interface CourseOrder extends Document {
  studentId: string;
  courseId: string;
  paymentId: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  purchaseDate: Date;
  isActive: boolean;
  completionStatus: 'not-started' | 'in-progress' | 'completed';
  lastAccessedDate: Date;
}

const CourseOrderSchema: Schema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  completionStatus: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  lastAccessedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const CourseOrder = mongoose.model<CourseOrder>('CourseOrder', CourseOrderSchema);