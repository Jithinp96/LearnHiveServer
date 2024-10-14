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

    async findCourseByTutorId(tutorId: string): Promise<Course[]> {
        
        try {
            const course = await CourseModel.find({ tutorId }).populate('category', 'name');
            console.log(course);
            
            return course
        } catch (error) {
            console.error('Error fetching courses for tutor:', error);
            throw new Error('Failed to fetch courses');
        }
    }

    async findAllCourse(): Promise<Course[]> {
        try {
            const course = await CourseModel.find({ isApproved: false, isBlocked: false })
            .populate('category', 'name');
            return course
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw new Error('Failed to fetch courses');
        }
    }

    async findCourseById(courseId: string): Promise<Course | null> {
        try {
            const course = await CourseModel.findById(courseId)
                .populate('tutorId', 'name')
                .populate('category', 'name');
            return course;
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw new Error('Failed to fetch course details');
        }
    }
}