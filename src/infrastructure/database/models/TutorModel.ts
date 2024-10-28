import mongoose, { Schema, Document } from "mongoose";

import { IEducation } from "../../../domain/entities/user/IEducation";
import { ISubjects } from "../../../domain/entities/user/ISubjects";
import { IWorkExperience } from "../../../domain/entities/user/IWorkExperience";

import { ProfileFieldsSchema } from "../schemas/profileFieldsSchema";
import { EducationSchema } from "../schemas/educationSchema";
import { SubjectSchema } from "../schemas/subjectSchema";
import { WorkExperienceSchema } from "../schemas/workExperienceSchema";

interface TutorDocument extends Document {
  tutorId: string;
  name: string;
  email: string;
  mobile: number;
  password: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: 'Tutor';
  profileImage: string;
  subjects: ISubjects[];
  education: IEducation[];
  workExperience: IWorkExperience[];
}

const TutorSchema: Schema = new Schema({
    tutorId: { 
        type: String,
        required: true 
    },
    ...ProfileFieldsSchema.obj,
    role: { type: String, enum: ['Tutor'], default: 'Tutor' },
    subjects: [SubjectSchema], 
    education: [EducationSchema],
    workExperience: [WorkExperienceSchema],
}, { timestamps: true });

export const TutorModel = mongoose.model<TutorDocument>("Tutor", TutorSchema);