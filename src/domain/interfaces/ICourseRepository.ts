import { CourseDocument } from '../../infrastructure/database/models/CourseModel';
import { ICourse } from '../entities/ICourse';
  
export interface ICourseRepository {
    addCourse(course: ICourse): Promise<ICourse>;
    findCourseById(id: string, studentId?: string): Promise<ICourse | null>;
    findCourseByTutorId(tutorId: string): Promise<ICourse[]>;
    // findAllCourse(filters: any): Promise<ICourse[]>;
    findAllCourse(filters: any, studentId?: string): Promise<ICourse[]>
    findAllCourseForAdmin(): Promise<ICourse[]>;
    findCourseById(courseId: string): Promise<ICourse | null>;
    approveCourse(courseId: string): Promise<void>;
    toggleBlockStatus(courseId: string, status: boolean): Promise<void>;
    findStudentCourseProgress(studentId: string): Promise<any | null>;

    getNewCourses(limit: number): Promise<CourseDocument[] | null>;
    getTopRatedCourses(limit: number): Promise<CourseDocument[] | null>;
    getSuggestedCourses(studentId: string, limit: number): Promise<CourseDocument[] | null>;
}