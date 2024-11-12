import { IAssessment } from "../../../domain/entities/IAssessment";
import { IAssessmentRepository } from "../../../domain/interfaces/IAssessmentRepository";

export class FetchAssessmentsByTutorUseCase {
    constructor(private _assessmentRepo: IAssessmentRepository) {}

    async execute(tutorId: string): Promise<IAssessment[]> {
        try {
            const assessments = await this._assessmentRepo.getAssessmentsByTutor(tutorId);
            return assessments;
        } catch (error) {
            console.error("Error fetching assessments by tutor:", error);
            throw new Error("Failed to fetch assessments for tutor");
        }
    }
}