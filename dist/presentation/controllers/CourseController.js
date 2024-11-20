"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const CourseUseCase_1 = require("../../application/useCases/CourseUseCase");
const CourseRepository_1 = require("../../infrastructure/repositories/CourseRepository");
const S3VideoUploadService_1 = require("../../infrastructure/services/S3VideoUploadService");
const client_s3_1 = require("@aws-sdk/client-s3");
const awsS3Config_1 = require("../../infrastructure/config/awsS3Config");
const CourseCategoryRepository_1 = require("../../infrastructure/repositories/CourseCategoryRepository");
const CourseCategory_1 = require("../../application/useCases/admin/CourseCategory");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const courseCategoryRepository = new CourseCategoryRepository_1.CourseCategoryRepository();
const courseCategoryUseCases = new CourseCategory_1.CourseCategoryUseCases(courseCategoryRepository);
const courseRepository = new CourseRepository_1.CourseRepository();
class CourseController {
    constructor() {
        this.getAllCategories = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield courseCategoryUseCases.getAllCategories();
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(categories);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch categories' });
            }
        });
        this.addCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseData = req.body;
                const newCourse = yield this._courseUseCase.addCourse(courseData);
                res.status(201).json(newCourse);
            }
            catch (error) {
                console.error('Error in addCourse:', error);
                res.status(500).json({ error: 'Failed to add course', details: error });
            }
        });
        this.editCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Inside edit course controller");
            const courseData = req.body;
            console.log("courseData in edit course controller: ", courseData);
            try {
            }
            catch (error) {
            }
        });
        this.approveCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Inside course approval controller");
            const { courseId } = req.params;
            console.log("courseId: ", courseId);
            try {
                yield this._courseUseCase.approveCourse(courseId);
                res.status(200).json({ message: 'Course approved successfully' });
            }
            catch (error) {
                console.error("Error approving course:", error);
                res.status(500).json({ message: 'Failed to approve course' });
            }
        });
        this.toggleCourseStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Inside togle block");
            const { courseId } = req.params;
            const { isBlocked } = req.body;
            console.log("courseId: ", courseId);
            console.log("isBlocked: ", isBlocked);
            try {
                yield this._courseUseCase.toggleCourseStatus(courseId, isBlocked);
            }
            catch (error) {
            }
        });
        this.uploadThumbnail = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            const command = new client_s3_1.PutObjectCommand(params);
            yield awsS3Config_1.s3.send(command);
            const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
            const thumbnail = {
                url: url
            };
            return res.status(200).json(thumbnail);
        });
        this.uploadVideoController = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const command = new client_s3_1.PutObjectCommand(params);
                yield awsS3Config_1.s3.send(command);
                const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
                const video = {
                    title: req.body.title,
                    description: req.body.description,
                    url: url
                };
                return res.status(200).json(video);
            }
            catch (error) {
                console.error('Error uploading video:', error);
                return res.status(500).json({ error: 'Error uploading video' });
            }
        });
        this.fetchTutorCourses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tutorId = req.query.id;
            if (!tutorId) {
                return res.status(400).json({ message: "Tutor ID is required" });
            }
            try {
                const courses = yield courseRepository.findCourseByTutorId(tutorId);
                res.status(200).json(courses);
            }
            catch (error) {
                console.error('Error fetching tutor courses:', error);
                res.status(500).json({ message: "Failed to fetch tutor's courses", details: error });
            }
        });
        // public fetchAllCourses = async(req: Request, res: Response) => {
        //     try {
        //         const courses = await this._courseUseCase.fetchAllCourse();
        //         res.status(200).json(courses);
        //     } catch (error) {
        //         res.status(500).json({ error: 'Failed to fetch courses' });
        //     }
        // }
        this.fetchAllCourses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, categories, levels } = req.query;
                const filters = {
                    isApproved: false,
                    isBlocked: false
                };
                // Add search filter
                if (search) {
                    filters.title = { $regex: search, $options: 'i' };
                }
                // Add category filter
                if (categories) {
                    filters.category = {
                        $in: categories.split(',')
                    };
                }
                // Add level filter
                if (levels) {
                    filters.level = {
                        $in: levels.split(',')
                    };
                }
                const courses = yield this._courseUseCase.fetchAllCourse(filters);
                res.status(200).json(courses);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch courses' });
            }
        });
        this.fetchAllCoursesforAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this._courseUseCase.fetchAllCourseForAdmin();
                res.status(200).json(courses);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch courses' });
            }
        });
        this.fetchCourseDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Inside fetch course Details");
                const { courseId } = req.params;
                const course = yield this._courseUseCase.fetchCourseDetails(courseId);
                console.log("course: ", course);
                res.status(200).json(course);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch course details' });
            }
        });
        const videoUploadService = new S3VideoUploadService_1.S3VideoUploadService;
        this._courseUseCase = new CourseUseCase_1.CourseUseCase(courseRepository, videoUploadService);
    }
}
exports.CourseController = CourseController;
