import mongoose, { Schema, Document } from "mongoose";
import { ProfileFieldsSchema } from "../schemas/profileFieldsSchema";
import { EducationSchema } from "../schemas/educationSchema";
import { IEducation } from "../../../domain/entities/user/IEducation";

interface StudentDocument extends Document {
  studentId: string;
  name: string;
  email: string;
  mobile: number;
  password: string; 
  isVerified: boolean;
  role: 'Student';
  isBlocked: boolean;
  profileImage: string;
  education: IEducation[];
}

const StudentSchema: Schema = new Schema({
  studentId: { type: String, required: true },
  ...ProfileFieldsSchema.obj,
  role: { type: String, enum: ['Student'], default: 'Student' },
  education: [EducationSchema],
  dob: { type: Date },
}, { timestamps: true });

export const StudentModel = mongoose.model<StudentDocument>("Student", StudentSchema);