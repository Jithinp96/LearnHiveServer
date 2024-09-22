import mongoose, { Schema, Document } from "mongoose";

interface StudentDocument extends Document {
  studentId: string;
  name: string;
  email: string;
  mobile: number;
  password: string;
  isVerified: boolean;
  role: 'student';
  isBlocked: boolean;
  createdAt: Date;
}

const StudentSchema: Schema = new Schema({
  studentId: { type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: 'student' },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const StudentModel = mongoose.model<StudentDocument>("Student", StudentSchema);