import { IStudentAssessment } from "../../../domain/entities/IAssessment";
import { IAssessmentRepository } from "../../../domain/interfaces/IAssessmentRepository";
import { IStudentAssessmentRepository } from "../../../domain/interfaces/IStudentAssessmentRepository";

export class SubmitStudentAssessmentUseCase {
    constructor(
        private _assessmentRepo: IAssessmentRepository,
        private _studentAssessmentRepo: IStudentAssessmentRepository
    ) {}

    async execute(studentAssessment: {
        studentId: string;
        assessmentId: string;
        responses: { [questionId: string]: number };
    }): Promise<IStudentAssessment> {
        const { studentId, assessmentId, responses } = studentAssessment;

        const responsesArray = Object.entries(responses).map(([questionId, selectedOption]) => ({
            questionId,
            selectedOption,
        }));

        const assessment = await this._assessmentRepo.getAssessmentById(assessmentId);
    
        if (!assessment) {
            throw new Error("Assessment not found");
        }

        let score = 0;
        for (const response of responsesArray) {
            const question = assessment.questions.find(q => q._id!.toString() === response.questionId);
            if (question && question.correctOption === response.selectedOption) {
                score += question.marks;
            }
        }

        const finalSubmission: IStudentAssessment = {
            studentId,
            assessmentId,
            responses: responsesArray,
            score,
            status: 'Completed',
            submittedDate: new Date()
        };

        return await this._studentAssessmentRepo.submitAssessment(finalSubmission);
    }
}
