import { Course } from '../entities/Course';
  
export interface ICourseRepository {
    addCourse(course: Course): Promise<Course>;
    findCourseById(id: string): Promise<Course | null>;
    findCourseByTutorId(tutorId: string): Promise<Course[]>;
    findAllCourse(): Promise<Course[]>;
    findCourseById(courseId: string): Promise<Course | null>;
}