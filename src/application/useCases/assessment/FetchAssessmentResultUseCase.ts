import { IStudentAssessment } from "../../../domain/entities/IAssessment";
import { IStudentAssessmentRepository } from "../../../domain/interfaces/IStudentAssessmentRepository";

export class FetchAssessmentResultByIdUseCase {
    constructor(
        private _studentAssessmentRepo: IStudentAssessmentRepository
    ) {}

    async execute(assessmentId: string): Promise<IStudentAssessment | null> {
        try {
            console.log("Fetching assessment result for ID:", assessmentId); // Log assessmentId

            const assessmentResult = await this._studentAssessmentRepo.getAssessmentResultById(assessmentId);

            if (!assessmentResult) {
                console.error("Assessment result not found for ID:", assessmentId);
                throw new Error("Assessment result not found");
            }

            return assessmentResult;
        } catch (error) {
            console.error("Error fetching assessment result by ID:", error);
            throw new Error("Failed to fetch assessment result details");
        }
    }
}

