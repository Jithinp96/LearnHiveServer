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
exports.AssessmentRepository = void 0;
const AssessmentModel_1 = require("../database/models/AssessmentModel");
const CourseOrderModel_1 = require("../database/models/CourseOrderModel");
const StudentAssessmentModel_1 = require("../database/models/StudentAssessmentModel");
class AssessmentRepository {
    createAssessment(assessment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newAssessment = new AssessmentModel_1.Assessment(assessment);
                return yield newAssessment.save();
            }
            catch (error) {
                console.error("Error in creating assessment from Assessment repository: ", error);
                throw new Error("Failed to create assessment");
            }
        });
    }
    getAssessmentsByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AssessmentModel_1.Assessment.find({ courseId });
        });
    }
    getAssessmentsByTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const assessments = yield AssessmentModel_1.Assessment.find({ tutorId })
                .populate('courseId', 'title');
            return assessments;
        });
    }
    getAssessmentsForStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completedCourses = yield CourseOrderModel_1.CourseOrder.find({
                    studentId,
                    isActive: true,
                    paymentStatus: 'Completed',
                    completionStatus: 'Completed'
                }).select('courseId');
                const completedCourseIds = completedCourses.map(order => order.courseId);
                if (completedCourseIds.length === 0) {
                    return [];
                }
                const assessments = yield AssessmentModel_1.Assessment.find({ courseId: { $in: completedCourseIds } })
                    .populate('courseId', 'title')
                    .lean(); // Convert to plain JavaScript object
                const assessmentIds = assessments.map((assessment) => assessment._id);
                // Find student's assessment attempts
                const studentAssessments = yield StudentAssessmentModel_1.StudentAssessmentModel.find({
                    studentId,
                    assessmentId: { $in: assessmentIds }
                }).lean();
                // Map assessments with their status
                const assessmentsWithStatus = assessments.map(assessment => {
                    // Find corresponding student assessment
                    const studentAssessment = studentAssessments.find(sa => sa.assessmentId.toString() === assessment._id.toString());
                    // Determine status
                    let status = 'not-started';
                    if (studentAssessment) {
                        status = studentAssessment.status === 'Completed'
                            ? 'completed'
                            : 'in-progress';
                    }
                    return Object.assign(Object.assign({}, assessment), { status, questions: assessment.questions || [] });
                });
                return assessmentsWithStatus;
            }
            catch (error) {
                console.error("Error fetching assessments for student:", error);
                throw new Error("Failed to fetch assessments for student");
            }
        });
    }
    // async submitStudentAssessment(studentAssessment: IStudentAssessment): Promise<IStudentAssessment> {
    //   const submission = new StudentAssessment(studentAssessment);
    //   return await submission.save();
    // }
    // async getStudentAssessments(studentId: string): Promise<IStudentAssessment[]> {
    //   return await StudentAssessment.find({ studentId }).populate('assessmentId');
    // }
    getAssessmentById(assessmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield AssessmentModel_1.Assessment.findById(assessmentId);
            }
            catch (error) {
                console.error("Error fetching assessment by ID:", error);
                throw new Error("Failed to fetch assessment by ID");
            }
        });
    }
}
exports.AssessmentRepository = AssessmentRepository;
