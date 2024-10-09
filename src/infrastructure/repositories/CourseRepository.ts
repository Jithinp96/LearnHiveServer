import { Course } from "../../domain/entities/Course";
import { ICourseRepository } from "../../domain/interfaces/ICourseRepository";
import { CourseModel } from "../database/models/CourseModel";

export class CourseRepository implements ICourseRepository {
    async addCourse(course: Course): Promise<Course> {
        try {
            const newCourse = new CourseModel(course);
            
            return await newCourse.save();
        } catch (error) {
            console.error('Error creating course:', error);
            throw new Error('Failed to create course');
        }
    }
  
    async findCourseById(id: string): Promise<Course | null> {
        return await CourseModel.findById(id);
    }
}