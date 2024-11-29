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
const CourseOrderModel_1 = require("../database/models/CourseOrderModel");
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
    findAllCourse(filters, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (studentId) {
                    const purchasedCourseIds = yield CourseOrderModel_1.CourseOrder.find({
                        studentId: studentId,
                        // status: 'completed' 
                    }).distinct('courseId');
                    filters._id = { $nin: purchasedCourseIds };
                }
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
    findStudentCourseProgress(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseProgress = yield CourseProgressSchema_1.CourseProgress.find({ studentId: studentId })
                    .populate("courseId", "title thumbnailUrl")
                    .exec();
                if (!courseProgress || courseProgress.length === 0) {
                    return null;
                }
                // console.log("courseProgress: ", courseProgress);
                return courseProgress;
            }
            catch (error) {
                console.error("Error fetching course progress from course repo:", error);
                throw new Error("Failed to fetch course progress.");
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
    toggleBlockStatus(courseId, isBlocked, isListed) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CourseModel_1.CourseModel.findByIdAndUpdate(courseId, { isBlocked: isBlocked, isListed });
        });
    }
    ///////////////////////////////////////////////
    getNewCourses(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.CourseModel.find({ isListed: true })
                    .sort({ createdAt: -1 })
                    .limit(limit);
                return courses.length > 0 ? courses : null;
            }
            catch (error) {
                console.error('Error fetching new courses:', error);
                return null;
            }
        });
    }
    getTopRatedCourses(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.CourseModel.aggregate([
                    { $match: { isListed: true } },
                    { $unwind: "$reviews" },
                    { $group: { _id: "$_id", averageRating: { $avg: "$reviews.rating" }, doc: { $first: "$$ROOT" } } },
                    { $sort: { averageRating: -1 } },
                    { $limit: limit },
                    { $replaceRoot: { newRoot: "$doc" } }
                ]);
                return courses.length > 0 ? courses : null;
            }
            catch (error) {
                console.error('Error fetching top-rated courses:', error);
                return null;
            }
        });
    }
    getSuggestedCourses(studentId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchasedCourses = yield CourseOrderModel_1.CourseOrder.find({ studentId, paymentStatus: 'Completed' }).populate('courseId');
                const purchasedTags = purchasedCourses.flatMap((order) => { var _a; return ((_a = order.courseId) === null || _a === void 0 ? void 0 : _a.tags) || []; });
                if (purchasedTags.length === 0) {
                    return null; // No relevant tags found
                }
                const courses = yield CourseModel_1.CourseModel.find({ tags: { $in: purchasedTags }, isListed: true })
                    .limit(limit);
                return courses.length > 0 ? courses : null;
            }
            catch (error) {
                console.error('Error fetching suggested courses:', error);
                return null;
            }
        });
    }
}
exports.CourseRepository = CourseRepository;
