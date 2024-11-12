import { IAssessment } from "../../../domain/entities/IAssessment";
import { IAssessmentRepository } from "../../../domain/interfaces/IAssessmentRepository";

export class CreateAssessmentUseCase {
    constructor(private _assessmentRepo: IAssessmentRepository) {}
  
    async execute(assessmentData: IAssessment, tutorId: string): Promise<IAssessment> {
      console.log("Reached create Assessment service");
      
      const assessment = {
        ...assessmentData,
        tutorId
      };
      
      return await this._assessmentRepo.createAssessment(assessment);
    }
}