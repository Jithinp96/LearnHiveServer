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
exports.CourseUseCase = void 0;
class CourseUseCase {
    constructor(_courseRepository, _videoUploadService) {
        this._courseRepository = _courseRepository;
        this._videoUploadService = _videoUploadService;
    }
    addCourse(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._courseRepository.addCourse(course);
        });
    }
    uploadVideo(videoData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, file } = videoData;
            const fileName = `${Date.now()}-${title}`;
            const fileUrl = yield this._videoUploadService.upload(file.buffer, fileName);
            const video = {
                title,
                description,
                url: fileUrl
            };
            return video;
        });
    }
    fetchAllCourse(filters, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this._courseRepository.findAllCourse(filters, studentId);
            }
            catch (error) {
                console.error('Error fetching courses:', error);
                throw new Error('Failed to fetch courses');
            }
        });
    }
    fetchAllCourseForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this._courseRepository.findAllCourseForAdmin();
            }
            catch (error) {
                console.error('Error fetching courses:', error);
                throw new Error('Failed to fetch courses');
            }
        });
    }
    fetchCourseDetails(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this._courseRepository.findCourseById(courseId);
            }
            catch (error) {
                console.error('Error fetching course details:', error);
                throw new Error('Failed to fetch course details');
            }
        });
    }
    fetchCourseViewer(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this._courseRepository.findCourseById(courseId, studentId);
            }
            catch (error) {
                console.error('Error fetching course details:', error);
                throw new Error('Failed to fetch course details');
            }
        });
    }
    fetchStudentCourseProgress(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this._courseRepository.findStudentCourseProgress(studentId);
            }
            catch (error) {
                throw new Error("Unable to fetch student course progress.");
            }
        });
    }
    approveCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepository.findCourseById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            yield this._courseRepository.approveCourse(courseId);
        });
    }
    toggleCourseStatus(courseId, isBlocked, isListed) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepository.findCourseById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            yield this._courseRepository.toggleBlockStatus(courseId, isBlocked, isListed);
        });
    }
}
exports.CourseUseCase = CourseUseCase;
