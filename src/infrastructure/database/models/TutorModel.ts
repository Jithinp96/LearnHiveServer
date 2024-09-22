import mongoose, { Schema} from "mongoose";

interface TutorDocument extends Document {
    name: string;
    email: string;
    mobile: number;
    password: string;
    isVerified: boolean;
    role: 'tutor';
}

const TutorSchema: Schema = new Schema ({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'tutor' }
});

export const TutorModel = mongoose.model<TutorDocument>("Tutor", TutorSchema);