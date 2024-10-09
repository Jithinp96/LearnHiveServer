import { Course } from '../entities/Course';
  
export interface ICourseRepository {
    addCourse(course: Course): Promise<Course>;
    findCourseById(id: string): Promise<Course | null>;
}