import mongoose, { Schema, Document } from "mongoose";

export interface ICourseCategory extends Document {
    name: string;
    isBlocked: boolean;
    coursesCount: number;
}

const CourseCategorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const CourseCategoryModel = mongoose.model<ICourseCategory>('CourseCategory', CourseCategorySchema);