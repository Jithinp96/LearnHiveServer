import { IAssessment } from "../../../domain/entities/IAssessment";
import { IAssessmentRepository } from "../../../domain/interfaces/IAssessmentRepository";

export class FetchAssessmentByIdUseCase {
  constructor(private _assessmentRepo: IAssessmentRepository) {}

  async execute(assessmentId: string): Promise<IAssessment | null> {
    try {
        const assessment = await this._assessmentRepo.getAssessmentById(assessmentId);
        if (!assessment) {
            throw new Error("Assessment not found");
        }
        return assessment;
    } catch (error) {
        console.error("Error fetching assessment by ID:", error);
        throw new Error("Failed to fetch assessment details");
    }
  }
}
