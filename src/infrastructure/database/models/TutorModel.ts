import mongoose, { Schema, Document } from "mongoose";

interface TutorEducation {
  level: string;
  board: string;
  startDate: string;
  endDate: string;
  grade: string;
  institution: string;
}

interface WorkExperience {
  institution: string;
  designation: string;
  startDate: string;
  endDate: string;
}

interface TutorDocument extends Document {
  tutorId: string;
  name: string;
  email: string;
  mobile: number;
  password: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: 'tutor';
  profileImage: string;
  subjects: string[];
  education: TutorEducation[];
  workExperience: WorkExperience[];
}

const EducationSchema: Schema = new Schema({
  level: { type: String, required: true },
  board: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  grade: { type: String, required: true },
  institution: { type: String, required: true },
});

const WorkExperienceSchema: Schema = new Schema({
  institution: { type: String, required: true },
  designation: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});

const TutorSchema: Schema = new Schema({
    tutorId: { 
        type: String,
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    mobile: { 
        type: Number, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    isBlocked: { 
        type: Boolean, 
        default: false 
    },
    role: { 
        type: String, 
        default: 'tutor' 
    },
    profileImage: { 
        type: String, 
        default: "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_1280.png"
    }, 
    subjects: { 
        type: [String], 
        default: [] 
    }, 
    education: { 
        type: [EducationSchema], 
        default: [] 
    }, 
    workExperience: { 
        type: [WorkExperienceSchema], 
        default: [] 
    },
}, { timestamps: true });

export const TutorModel = mongoose.model<TutorDocument>("Tutor", TutorSchema);
