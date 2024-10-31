import { Schema, model, Document } from 'mongoose';

interface TutorSlotDocument extends Document {
    tutorId: string;
    subject: string;
    level: string;
    date: Date;
    startTime: string;
    endTime: string;
    price: number;
    isBooked: boolean;
    studentId: string;
    meetingId: string;
    meetingLink: string;
}

const TutorSlotSchema: Schema = new Schema({
    tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
    subject: { type: String, required: true },
    level: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', default: null },
    meetingId: { type: String, default: null },
    meetingLink: { type: String, default: null }
}, {timestamps: true});

export const TutorSlotModel = model<TutorSlotDocument>('TutorSlot', TutorSlotSchema);