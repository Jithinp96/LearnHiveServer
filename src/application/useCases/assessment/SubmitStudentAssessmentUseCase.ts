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
    }): Promise<IStudentAssessment | null> {
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
        const totalMarks = assessment.questions.reduce((sum, q) => sum + q.marks, 0);

        for (const response of responsesArray) {
            const question = assessment.questions.find(q => q._id!.toString() === response.questionId);
            if (question && question.correctOption === response.selectedOption) {
                score += question.marks;
            }
        }

        // Calculate score percentage
        const scorePercentage = (score / totalMarks) * 100;

        // Check if the student has passed
        const hasPassed = scorePercentage >= assessment.passingScore;

        // Only create and save if student has passed
        if (hasPassed) {
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

        // Return null if student has not passed
        return null;
    }
}