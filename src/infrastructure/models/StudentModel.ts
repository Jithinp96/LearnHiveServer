import mongoose, { Schema, Document } from "mongoose";

interface IStudent extends Document {
    name: string;
    email: string;
    mobile: number;
    password: string;
    createdAt: Date;
}

const StudentSchema: Schema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    mobile: { type: Number, required: true, unique: true},
    password: { type: String, required: true},
    createdAt: { type: Date, default: Date.now},
})

export const StudentModel = mongoose.model<IStudent>('Student', StudentSchema)