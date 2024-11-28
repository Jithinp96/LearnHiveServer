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
const InitializeCourseProgressUseCase_1 = require("../../application/useCases/course/InitializeCourseProgressUseCase");
const ProgressRepository_1 = require("../../infrastructure/repositories/ProgressRepository");
const UpdateCourseProgressUseCase_1 = require("../../application/useCases/course/UpdateCourseProgressUseCase");
const OrderRepository_1 = require("../../infrastructure/repositories/OrderRepository");
const ErrorMessagesEnum_1 = require("../../shared/enums/ErrorMessagesEnum");
const courseCategoryRepository = new CourseCategoryRepository_1.CourseCategoryRepository();
const courseCategoryUseCases = new CourseCategory_1.CourseCategoryUseCases(courseCategoryRepository);
const courseRepository = new CourseRepository_1.CourseRepository();
const progressRepository = new ProgressRepository_1.ProgressRepository();
const orderRepository = new OrderRepository_1.OrderRepository;
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
            const { courseId } = req.params;
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
            const { courseId } = req.params;
            const { isBlocked } = req.body;
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
        this.fetchAllCourses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, categories, levels, studentId } = req.query;
                const filters = {
                    isApproved: true,
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
                const courses = yield this._courseUseCase.fetchAllCourse(filters, studentId);
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
                const { courseId } = req.params;
                const course = yield this._courseUseCase.fetchCourseDetails(courseId);
                res.status(200).json(course);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch course details' });
            }
        });
        this.fetchCourseView = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const studentId = req.userId;
                if (!studentId) {
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({
                        success: false,
                        message: ErrorMessagesEnum_1.AuthErrorEnum.INVALID_ID
                    });
                }
                const course = yield this._courseUseCase.fetchCourseViewer(courseId, studentId);
                res.status(200).json(course);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch course details' });
            }
        });
        this.fetchStudentCourseProgress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.userId;
                if (!studentId) {
                    return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({
                        success: false,
                        message: ErrorMessagesEnum_1.AuthErrorEnum.INVALID_ID
                    });
                }
                const courseProgress = yield this._courseUseCase.fetchStudentCourseProgress(studentId);
                return res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({
                    success: true,
                    data: courseProgress,
                });
            }
            catch (error) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "An error occurred while fetching course progress.",
                });
            }
        });
        this.updateCourseProgress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.userId;
                const { courseId, videoId } = req.body;
                if (!studentId || !courseId || !videoId) {
                    return res.status(400).json({
                        message: "StudentId, courseId, and videoId are required to update progress.",
                    });
                }
                yield this._updateCourseProgressUseCase.execute({ studentId, courseId, videoId });
                res.status(200).json({ message: "Progress updated successfully." });
            }
            catch (error) {
                console.error("Error updating course progress:", error);
                res.status(500).json({ message: "Failed to update progress.", error: error });
            }
        });
        const videoUploadService = new S3VideoUploadService_1.S3VideoUploadService;
        this._courseUseCase = new CourseUseCase_1.CourseUseCase(courseRepository, videoUploadService);
        this._initializeCourseProgressUseCase = new InitializeCourseProgressUseCase_1.InitializeCourseProgressUseCase(progressRepository);
        this._updateCourseProgressUseCase = new UpdateCourseProgressUseCase_1.UpdateCourseProgressUseCase(progressRepository, orderRepository);
    }
}
exports.CourseController = CourseController;
