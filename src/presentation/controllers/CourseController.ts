import { Request, Response } from 'express';
import { CourseUseCase } from '../../application/useCases/CourseUseCase';
import { CourseRepository } from '../../infrastructure/repositories/CourseRepository';
import { S3VideoUploadService } from '../../infrastructure/services/S3VideoUploadService';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../../infrastructure/config/awsS3Config';
import { CourseCategoryRepository } from '../../infrastructure/repositories/CourseCategoryRepository';
import { CourseCategoryUseCases } from '../../application/useCases/admin/CourseCategory';
import { HttpStatusEnum } from '../../shared/enums/HttpStatusEnum';

const courseCategoryRepository = new CourseCategoryRepository();
const courseCategoryUseCases = new CourseCategoryUseCases(courseCategoryRepository);
const courseRepository = new CourseRepository();

export class CourseController {
    private _courseUseCase: CourseUseCase;

    constructor() {
        const videoUploadService = new S3VideoUploadService
        this._courseUseCase = new CourseUseCase(courseRepository, videoUploadService);
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
            console.log("Course data in course controller: ", courseData);
            
            const newCourse = await this._courseUseCase.addCourse(courseData);

            res.status(201).json(newCourse);
        } catch (error) {
            console.error('Error in addCourse:', error);
            res.status(500).json({ error: 'Failed to add course', details: error });
        }
    }

    public uploadThumbnail = async (req: Request, res: Response) => {
        const bucketRegion = process.env.S3_BUCKET_REGION;
        const bucketName = process.env.S3_BUCKET_NAME;
        console.log("Reached inside upload thumbnail controller in course controller");
        console.log("req.file: ", req.file);
        

        if (!req.file) {
            console.log("No file received");
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
            const awsAccessKey = process.env.S3_ACCESS_KEY;
            const secretKey = process.env.S3_SECRET_KEY;
            const bucketRegion = process.env.S3_BUCKET_REGION;
            const bucketName = process.env.S3_BUCKET_NAME;
            
            if (!req.file) {
                console.log("No file received");
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
        console.log("Reached course controller");
        
        const tutorId = req.query.id as string;
        console.log("Tutor id: ", tutorId);
        
        if (!tutorId) {
            return res.status(400).json({ message: "Tutor ID is required" });
        }

        try {
            const courses = await courseRepository.findCourseByTutorId(tutorId);
            console.log("courses in course controller: ", courses);
            
            res.status(200).json(courses);
        } catch (error) {
            console.error('Error fetching tutor courses:', error);
            res.status(500).json({ message: "Failed to fetch tutor's courses", details: error });
        }
    };
}