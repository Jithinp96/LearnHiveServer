import mongoose, { Schema, Document } from "mongoose";

interface CourseOrder extends Document {
  studentId: string;
  courseId: string;
  paymentId: string;
  amount: number;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  purchaseDate: Date;
  isActive: boolean;
  completionStatus: 'Not-Started' | 'In-Progress' | 'Completed';
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
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
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
    enum: ['Not-Started', 'In-Progress', 'Completed'],
    default: 'Not-Started'
  },
  lastAccessedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const CourseOrder = mongoose.model<CourseOrder>('CourseOrder', CourseOrderSchema);