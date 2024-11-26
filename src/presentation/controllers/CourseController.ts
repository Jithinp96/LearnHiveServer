import { Request, Response } from 'express';
import { CourseUseCase } from '../../application/useCases/CourseUseCase';
import { CourseRepository } from '../../infrastructure/repositories/CourseRepository';
import { S3VideoUploadService } from '../../infrastructure/services/S3VideoUploadService';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../../infrastructure/config/awsS3Config';
import { CourseCategoryRepository } from '../../infrastructure/repositories/CourseCategoryRepository';
import { CourseCategoryUseCases } from '../../application/useCases/admin/CourseCategory';
import { HttpStatusEnum } from '../../shared/enums/HttpStatusEnum';
import { InitializeCourseProgressUseCase } from '../../application/useCases/course/InitializeCourseProgressUseCase';
import { ProgressRepository } from '../../infrastructure/repositories/ProgressRepository';
import { UpdateCourseProgressUseCase } from '../../application/useCases/course/UpdateCourseProgressUseCase';
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository';
import { AuthErrorEnum } from '../../shared/enums/ErrorMessagesEnum';

const courseCategoryRepository = new CourseCategoryRepository();
const courseCategoryUseCases = new CourseCategoryUseCases(courseCategoryRepository);
const courseRepository = new CourseRepository();
const progressRepository = new ProgressRepository();
const orderRepository = new OrderRepository

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export class CourseController {
    private _courseUseCase: CourseUseCase;
    private _initializeCourseProgressUseCase: InitializeCourseProgressUseCase;
    private _updateCourseProgressUseCase: UpdateCourseProgressUseCase;

    constructor() {
        const videoUploadService = new S3VideoUploadService
        this._courseUseCase = new CourseUseCase(courseRepository, videoUploadService);
        this._initializeCourseProgressUseCase = new InitializeCourseProgressUseCase(progressRepository);
        this._updateCourseProgressUseCase = new UpdateCourseProgressUseCase(progressRepository, orderRepository)
    }
    
    public getAllCategories = async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await courseCategoryUseCases.getAllCategories();
            res.status(HttpStatusEnum.OK).json(categories);
        } catch (error) {
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch categories' });
        }
    }
    


    public addCourse = async(req: Request, res: Response): Promise<void> => {
        try {
            const courseData = req.body;
            const newCourse = await this._courseUseCase.addCourse(courseData);

            res.status(201).json(newCourse);
        } catch (error) {
            console.error('Error in addCourse:', error);
            res.status(500).json({ error: 'Failed to add course', details: error });
        }
    }
    
    public editCourse = async(req: Request, res: Response) => {
        console.log("Inside edit course controller");
        const courseData = req.body;
        console.log("courseData in edit course controller: ", courseData);
        
        try {
            
        } catch (error) {
            
        }
    }

    public approveCourse = async(req: Request, res: Response) => {
        const { courseId } = req.params;
        
        try {
            await this._courseUseCase.approveCourse(courseId)
            res.status(200).json({ message: 'Course approved successfully' });
        } catch (error) {
            console.error("Error approving course:", error);
            res.status(500).json({ message: 'Failed to approve course' });
        }
    }

    public toggleCourseStatus = async(req: Request, res: Response) => {
        const { courseId } = req.params;
        const { isBlocked } = req.body; 
        
        try {
            await this._courseUseCase.toggleCourseStatus(courseId, isBlocked)
        } catch (error) {
            
        }
        
    }

    public uploadThumbnail = async (req: Request, res: Response) => {
        const bucketRegion = process.env.S3_BUCKET_REGION;
        const bucketName = process.env.S3_BUCKET_NAME;

        if (!req.file) {
            return res.status(400).json({ error: 'No thumbnail file provided' });
        }
        const fileName = `${Date.now()}-${req.file.originalname}`;

        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params)
        await s3.send(command)

        const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;

        const thumbnail = {
            url: url
        };

        return res.status(200).json(thumbnail);
    }

    public uploadVideoController = async (req: Request, res: Response) => {
        try {
            const bucketRegion = process.env.S3_BUCKET_REGION;
            const bucketName = process.env.S3_BUCKET_NAME;
            
            if (!req.file) {
                return res.status(400).json({ error: 'No video file provided' });
            }
            const fileName = `${Date.now()}-${req.file.originalname}`;

            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };
            const command = new PutObjectCommand(params)
            await s3.send(command)

            const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;

            const video = {
                title: req.body.title,
                description: req.body.description,
                url: url
            };

            return res.status(200).json(video);
        } catch (error) {
            console.error('Error uploading video:', error);
            return res.status(500).json({ error: 'Error uploading video' });
        }
    }

    public fetchTutorCourses = async (req: Request, res: Response) => {
        const tutorId = req.query.id as string;
        
        if (!tutorId) {
            return res.status(400).json({ message: "Tutor ID is required" });
        }

        try {
            const courses = await courseRepository.findCourseByTutorId(tutorId);
            res.status(200).json(courses);
        } catch (error) {
            console.error('Error fetching tutor courses:', error);
            res.status(500).json({ message: "Failed to fetch tutor's courses", details: error });
        }
    };

    public fetchAllCourses = async(req: Request, res: Response) => {
        try {
            const { search, categories, levels } = req.query;
            
            const filters: any = {
                isApproved: false,
                isBlocked: false
            };
    
            // Add search filter
            if (search) {
                filters.title = { $regex: search as string, $options: 'i' };
            }
    
            // Add category filter
            if (categories) {
                filters.category = {
                    $in: (categories as string).split(',')
                };
            }
    
            // Add level filter
            if (levels) {
                filters.level = {
                    $in: (levels as string).split(',')
                };
            }
    
            const courses = await this._courseUseCase.fetchAllCourse(filters);
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch courses' });
        }
    }

    public fetchAllCoursesforAdmin = async(req: Request, res: Response) => {
        try {
            const courses = await this._courseUseCase.fetchAllCourseForAdmin();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch courses' });
        }
    }

    public fetchCourseDetails = async(req: Request, res: Response) => {
        try {
            const {courseId} = req.params
            const course = await this._courseUseCase.fetchCourseDetails(courseId);
            
            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch course details' });
        }
    }

    public fetchCourseView = async(req: AuthenticatedRequest, res: Response) => {
        try {
            const { courseId } = req.params;
            const studentId = req.userId;

            if (!studentId) {
                return res.status(HttpStatusEnum.UNAUTHORIZED).json({
                    success: false,
                    message: AuthErrorEnum.INVALID_ID
                });
              }
            const course = await this._courseUseCase.fetchCourseViewer(courseId, studentId);
            
            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch course details' });
        }
    }

    public fetchStudentCourseProgress = async(req: AuthenticatedRequest, res: Response) => {
        try {
            const studentId = req.userId
            if (!studentId) {
                return res.status(HttpStatusEnum.UNAUTHORIZED).json({
                    success: false,
                    message: AuthErrorEnum.INVALID_ID
                });
            }

            const courseProgress = await this._courseUseCase.fetchStudentCourseProgress(studentId);
            return res.status(HttpStatusEnum.OK).json({
                success: true,
                data: courseProgress,
            });
        } catch (error) {
            return res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An error occurred while fetching course progress.",
            });
        }
    }

    public updateCourseProgress = async(req: AuthenticatedRequest, res: Response) => {
        try {
            const studentId = req.userId;
            const { courseId, videoId } = req.body;
    
            if (!studentId || !courseId || !videoId) {
                return res.status(400).json({
                    message: "StudentId, courseId, and videoId are required to update progress.",
                });
            }
    
            await this._updateCourseProgressUseCase.execute({ studentId, courseId, videoId });
            res.status(200).json({ message: "Progress updated successfully." });
        } catch (error) {
            console.error("Error updating course progress:", error);
            res.status(500).json({ message: "Failed to update progress.", error: error });
        }
    }
}