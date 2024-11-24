import { ICourseProgress } from "../entities/ICourseProgress";

export interface IProgressRepository {
  findByStudentAndCourse(studentId: string, courseId: string): Promise<ICourseProgress | null>;
  create(progress: ICourseProgress): Promise<void>;
  update(progress: ICourseProgress): Promise<void>;
}