import { Schema, model, Document } from 'mongoose';

interface TutorSlotPreferenceDocument extends Document {
    tutorId: string;
    subject: string;
    level: string;
    endDate: Date;
    startTime: string;
    endTime: string;
    price: number;
    requiresDailySlotCreation: boolean;
}

const TutorSlotPreferenceSchema: Schema = new Schema({
    tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
    subject: { type: String, required: true },
    endDate: { type: Date, required: true },
    level: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    requiresDailySlotCreation: { type: Boolean, default: false }
}, {timestamps: true});

export const TutorSlotPreferenceModel = model<TutorSlotPreferenceDocument>('TutorSlotPreference', TutorSlotPreferenceSchema);