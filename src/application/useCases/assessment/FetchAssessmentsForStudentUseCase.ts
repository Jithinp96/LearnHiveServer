import { IAssessment } from "../../../domain/entities/IAssessment";
import { IAssessmentRepository } from "../../../domain/interfaces/IAssessmentRepository";

export class FetchAssessmentsForStudentUseCase {
  constructor(private _assessmentRepo: IAssessmentRepository) {}

  async execute(studentId: string): Promise<IAssessment[] | null> {
    try {
      return await this._assessmentRepo.getAssessmentsForStudent(studentId);
    } catch (error) {
      console.error("Error in FetchAssessmentsForStudent use case:", error);
      throw new Error("Failed to fetch assessments for student");
    }
  }
}