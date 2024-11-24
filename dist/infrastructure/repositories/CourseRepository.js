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
exports.CourseRepository = void 0;
const CourseModel_1 = require("../database/models/CourseModel");
const CourseProgressSchema_1 = require("../database/models/CourseProgressSchema");
class CourseRepository {
    addCourse(course) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCourse = new CourseModel_1.CourseModel(course);
                return yield newCourse.save();
            }
            catch (error) {
                console.error('Error creating course:', error);
                throw new Error('Failed to create course');
            }
        });
    }
    findCourseByTutorId(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield CourseModel_1.CourseModel.find({ tutorId }).populate('category', 'name');
                return course;
            }
            catch (error) {
                console.error('Error fetching courses for tutor:', error);
                throw new Error('Failed to fetch courses');
            }
        });
    }
    findAllCourse(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.CourseModel.find(filters)
                    .populate('category', 'name');
                return courses;
            }
            catch (error) {
                console.error('Error fetching courses:', error);
                throw new Error('Failed to fetch courses');
            }
        });
    }
    findAllCourseForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield CourseModel_1.CourseModel.find()
                    .populate('category', 'name');
                return course;
            }
            catch (error) {
                console.error('Error fetching courses:', error);
                throw new Error('Failed to fetch courses');
            }
        });
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
    findCourseById(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield CourseModel_1.CourseModel.findById(courseId)
                    .populate('tutorId', 'name profileImage')
                    .populate('category', 'name')
                    .populate('reviews.userId', 'name profileImage')
                    .populate('comments.userId', 'name profileImage');
                if (course && studentId) {
                    // Fetch progress information
                    const progress = yield CourseProgressSchema_1.CourseProgress.findOne({
                        courseId: courseId,
                        studentId: studentId
                    });
                    // Add progress information to the course object
                    return Object.assign(Object.assign({}, course.toObject()), { progress: progress ? {
                            completedVideos: progress.completedVideos,
                            progressPercentage: progress.progressPercentage,
                            lastWatchedVideo: progress.lastWatchedVideo,
                            isCompleted: progress.isCompleted
                        } : null });
                }
                return course;
            }
            catch (error) {
                console.error('Error fetching course details:', error);
                throw new Error('Failed to fetch course details');
            }
        });
    }
    approveCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CourseModel_1.CourseModel.findByIdAndUpdate(courseId, {
                isApproved: true,
                isListed: true
            });
        });
    }
    toggleBlockStatus(courseId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CourseModel_1.CourseModel.findByIdAndUpdate(courseId, { isBlocked: status });
        });
    }
}
exports.CourseRepository = CourseRepository;
