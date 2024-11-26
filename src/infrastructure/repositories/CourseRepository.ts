import { ICourse } from "../../domain/entities/ICourse";
import { ICourseRepository } from "../../domain/interfaces/ICourseRepository";
import { CourseDocument, CourseModel } from "../database/models/CourseModel";
import { CourseOrder } from "../database/models/CourseOrderModel";
import { CourseProgress } from "../database/models/CourseProgressSchema";

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
            return course
        } catch (error) {
            console.error('Error fetching courses for tutor:', error);
            throw new Error('Failed to fetch courses');
        }
    }

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

    // async findCourseById(courseId: string): Promise<ICourse | null> {
    //     try {
    //         const course = await CourseModel.findById(courseId)
    //             .populate('tutorId', 'name profileImage')
    //             .populate('category', 'name')
    //             .populate('reviews.userId', 'name profileImage')
    //             .populate('comments.userId', 'name profileImage')
    //         return course;
    //     } catch (error) {
    //         console.error('Error fetching course details:', error);
    //         throw new Error('Failed to fetch course details');
    //     }
    // }

    async findCourseById(courseId: string, studentId?: string): Promise<ICourse | null> {
        try {
            const course = await CourseModel.findById(courseId)
                .populate('tutorId', 'name profileImage')
                .populate('category', 'name')
                .populate('reviews.userId', 'name profileImage')
                .populate('comments.userId', 'name profileImage');
    
            if (course && studentId) {
                // Fetch progress information
                const progress = await CourseProgress.findOne({
                    courseId: courseId,
                    studentId: studentId
                });
    
                // Add progress information to the course object
                return {
                    ...course.toObject(),
                    progress: progress ? {
                        completedVideos: progress.completedVideos,
                        progressPercentage: progress.progressPercentage,
                        lastWatchedVideo: progress.lastWatchedVideo,
                        isCompleted: progress.isCompleted
                    } : null
                };
            }
    
            return course;
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw new Error('Failed to fetch course details');
        }
    }

    async findStudentCourseProgress(studentId: string): Promise<any | null> {
        try {
            const courseProgress = await CourseProgress.find({studentId: studentId})
                .populate("courseId", "title thumbnailUrl")
                .exec();

            if (!courseProgress || courseProgress.length === 0) {
                return null;
            }
            // console.log("courseProgress: ", courseProgress);
            return courseProgress
        } catch (error) {
            console.error("Error fetching course progress from course repo:", error);
            throw new Error("Failed to fetch course progress.");
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


    ///////////////////////////////////////////////

    async getNewCourses(limit: number): Promise<CourseDocument[] | null> {
        try {
            const courses = await CourseModel.find({ isListed: true })
                .sort({ createdAt: -1 })
                .limit(limit);
            return courses.length > 0 ? courses : null;
        } catch (error) {
            console.error('Error fetching new courses:', error);
            return null;
        }
    }

    async getTopRatedCourses(limit: number): Promise<CourseDocument[] | null> {
        try {
            const courses = await CourseModel.aggregate([
                { $match: { isListed: true } },
                { $unwind: "$reviews" },
                { $group: { _id: "$_id", averageRating: { $avg: "$reviews.rating" }, doc: { $first: "$$ROOT" } } },
                { $sort: { averageRating: -1 } },
                { $limit: limit },
                { $replaceRoot: { newRoot: "$doc" } }
            ]);
            return courses.length > 0 ? courses : null;
        } catch (error) {
            console.error('Error fetching top-rated courses:', error);
            return null;
        }
    }

    async getSuggestedCourses(studentId: string, limit: number): Promise<CourseDocument[] | null> {
        try {
            const purchasedCourses = await CourseOrder.find({ studentId, paymentStatus: 'Completed' }).populate('courseId');
            const purchasedTags = purchasedCourses.flatMap((order) => (order.courseId as any)?.tags || []);
            
            if (purchasedTags.length === 0) {
                return null; // No relevant tags found
            }

            const courses = await CourseModel.find({ tags: { $in: purchasedTags }, isListed: true })
                .limit(limit);
            return courses.length > 0 ? courses : null;
        } catch (error) {
            console.error('Error fetching suggested courses:', error);
            return null;
        }
    }

}