import { ICourse } from '../entities/ICourse';
  
export interface ICourseRepository {
    addCourse(course: ICourse): Promise<ICourse>;
    findCourseById(id: string): Promise<ICourse | null>;
    findCourseByTutorId(tutorId: string): Promise<ICourse[]>;
    findAllCourse(): Promise<ICourse[]>;
    findAllCourseForAdmin(): Promise<ICourse[]>;
    findCourseById(courseId: string): Promise<ICourse | null>;
    approveCourse(courseId: string): Promise<void>;
    toggleBlockStatus(courseId: string, status: boolean): Promise<void>;
}