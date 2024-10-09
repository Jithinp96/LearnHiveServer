import mongoose, { Schema, Document } from "mongoose";

interface Education {
  level: string;
  board: string;
  startDate: string;
  endDate: string;
  grade: string;
  institution: string;
}

interface StudentDocument extends Document {
  studentId: string;
  name: string;
  email: string;
  mobile: number;
  password: string;
  isVerified: boolean;
  role: 'student';
  isBlocked: boolean;
  profileImage: string;
  education: Education[];
}

const EducationSchema: Schema = new Schema({
  level: { type: String, required: true },
  board: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  grade: { type: String, required: true },
  institution: { type: String, required: true }
});

const StudentSchema: Schema = new Schema({
  studentId: { 
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
  role: { 
    type: String, 
    default: 'student' 
  },
  profileImage:{ 
    type:String, 
    default:'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_1280.png'
  },
  isBlocked: { 
    type: Boolean, 
    default: false 
  },
  dob: {
    type: Date
  },
  education: [EducationSchema]
}, { timestamps: true });

export const StudentModel = mongoose.model<StudentDocument>("Student", StudentSchema);