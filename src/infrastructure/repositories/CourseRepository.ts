import { ICourse } from "../../domain/entities/ICourse";
import { ICourseRepository } from "../../domain/interfaces/ICourseRepository";
import { CourseModel } from "../database/models/CourseModel";

export class CourseRepository implements ICourseRepository {
    async addCourse(course: ICourse): Promise<ICourse> {
        try {
            const newCourse = new CourseModel(course);     
            return await newCourse.save();
        } catch (error) {
            console.error('Error creating course:', error);
            throw new Error('Failed to create course');
        }
    }

    async findCourseByTutorId(tutorId: string): Promise<ICourse[]> {
        
        try {
            const course = await CourseModel.find({ tutorId }).populate('category', 'name');
            console.log(course);
            
            return course
        } catch (error) {
            console.error('Error fetching courses for tutor:', error);
            throw new Error('Failed to fetch courses');
        }
    }

    // async findAllCourse(): Promise<ICourse[]> {
    //     try {
    //         const course = await CourseModel.find({ isApproved: false, isBlocked: false })
    //         .populate('category', 'name');
    //         return course
    //     } catch (error) {
    //         console.error('Error fetching courses:', error);
    //         throw new Error('Failed to fetch courses');
    //     }
    // }

    async findAllCourse(filters: any): Promise<ICourse[]> {
        try {
            const courses = await CourseModel.find(filters)
                .populate('category', 'name');
            return courses;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw new Error('Failed to fetch courses');
        }
    }

    async findAllCourseForAdmin(): Promise<ICourse[]> {
        try {
            const course = await CourseModel.find()
            .populate('category', 'name');
            return course
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw new Error('Failed to fetch courses');
        }
    }

    async findCourseById(courseId: string): Promise<ICourse | null> {
        try {
            const course = await CourseModel.findById(courseId)
                .populate('tutorId', 'name')
                .populate('category', 'name')
                .populate('reviews.userId', 'name profileImage')
                .populate('comments.userId', 'name profileImage')
            return course;
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw new Error('Failed to fetch course details');
        }
    }

    async approveCourse(courseId: string): Promise<void> {
        await CourseModel.findByIdAndUpdate(courseId, { 
            isApproved: true,
            isListed: true
        });
    }
    
    async toggleBlockStatus(courseId: string, status: boolean): Promise<void> {
        await CourseModel.findByIdAndUpdate(courseId, { isBlocked: status });
    }
}