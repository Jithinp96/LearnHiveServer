import mongoose, { Schema} from "mongoose";

interface TutorDocument extends Document {
    tutorId: string;
    name: string;
    email: string;
    mobile: number;
    password: string;
    isVerified: boolean;
    isBlocked: boolean
    role: 'tutor';
    createdAt: Date;
}

const TutorSchema: Schema = new Schema ({
    tutorId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false},
    role: { type: String, default: 'tutor' },
    createdAt: { type: Date, default: Date.now}
});

export const TutorModel = mongoose.model<TutorDocument>("Tutor", TutorSchema);