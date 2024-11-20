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
exports.SubmitStudentAssessmentUseCase = void 0;
class SubmitStudentAssessmentUseCase {
    constructor(_assessmentRepo, _studentAssessmentRepo) {
        this._assessmentRepo = _assessmentRepo;
        this._studentAssessmentRepo = _studentAssessmentRepo;
    }
    execute(studentAssessment) {
        return __awaiter(this, void 0, void 0, function* () {
            const { studentId, assessmentId, responses } = studentAssessment;
            const responsesArray = Object.entries(responses).map(([questionId, selectedOption]) => ({
                questionId,
                selectedOption,
            }));
            const assessment = yield this._assessmentRepo.getAssessmentById(assessmentId);
            if (!assessment) {
                throw new Error("Assessment not found");
            }
            let score = 0;
            for (const response of responsesArray) {
                const question = assessment.questions.find(q => q._id.toString() === response.questionId);
                if (question && question.correctOption === response.selectedOption) {
                    score += question.marks;
                }
            }
            const finalSubmission = {
                studentId,
                assessmentId,
                responses: responsesArray,
                score,
                status: 'Completed',
                submittedDate: new Date()
            };
            return yield this._studentAssessmentRepo.submitAssessment(finalSubmission);
        });
    }
}
exports.SubmitStudentAssessmentUseCase = SubmitStudentAssessmentUseCase;
