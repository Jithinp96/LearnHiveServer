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

    async findCourseByTutorId(tutorId: string): Promise<Course[]> {
        console.log("Reached findCourseByTutorId in course repository");
        
        try {
            console.log("Try in findCourseByTutorId in course repository");
            
            return await CourseModel.find({ tutorId });
        } catch (error) {
            console.error('Error fetching courses for tutor:', error);
            throw new Error('Failed to fetch courses');
        }
    }
}