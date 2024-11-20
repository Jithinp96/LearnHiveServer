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
exports.StudentAssessmentRepository = void 0;
const StudentAssessmentModel_1 = require("../database/models/StudentAssessmentModel");
class StudentAssessmentRepository {
    submitAssessment(studentAssessment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield new StudentAssessmentModel_1.StudentAssessmentModel(studentAssessment).save();
            }
            catch (error) {
                console.error("Error in submitting assessment:", error);
                throw new Error("Failed to submit assessment");
            }
        });
    }
    getStudentAssessment(studentId, assessmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield StudentAssessmentModel_1.StudentAssessmentModel.findOne({ studentId, assessmentId });
        });
    }
    getAssessmentResultById(assessmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield StudentAssessmentModel_1.StudentAssessmentModel.findOne({ assessmentId })
                    .populate('studentId', 'name email')
                    .populate('assessmentId', 'title description');
            }
            catch (error) {
                console.error("Error in fetching assessment result in repository:", error);
                throw new Error("Failed to fetch assessment result");
            }
        });
    }
}
exports.StudentAssessmentRepository = StudentAssessmentRepository;