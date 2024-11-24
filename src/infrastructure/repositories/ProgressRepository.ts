import { IProgressRepository } from "../../domain/interfaces/IProgressRepository";
import { ICourseProgress } from "../../domain/entities/ICourseProgress";
import { CourseProgress } from "../database/models/CourseProgressSchema";

export class ProgressRepository implements IProgressRepository {
    async findByStudentAndCourse(studentId: string, courseId: string): Promise<ICourseProgress | null> {
        return await CourseProgress.findOne({ studentId, courseId });
    }

    async create(progress: ICourseProgress): Promise<void> {
        const newProgress = new CourseProgress(progress);
        await newProgress.save();
    }

    async update(progress: ICourseProgress): Promise<void> {
        await CourseProgress.findByIdAndUpdate(progress._id, progress, { new: true });
    }
}
