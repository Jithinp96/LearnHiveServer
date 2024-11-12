import { IStudentAssessment } from "../../domain/entities/IAssessment";
import { IStudentAssessmentRepository } from "../../domain/interfaces/IStudentAssessmentRepository";
import { StudentAssessmentModel } from "../database/models/StudentAssessmentModel";

export class StudentAssessmentRepository implements IStudentAssessmentRepository {
    async submitAssessment(studentAssessment: IStudentAssessment): Promise<IStudentAssessment> {
        try {
            return await new StudentAssessmentModel(studentAssessment).save();
        } catch (error) {
            console.error("Error in submitting assessment:", error);
            throw new Error("Failed to submit assessment");
        }
    }

    async getStudentAssessment(studentId: string, assessmentId: string): Promise<IStudentAssessment | null> {
        return await StudentAssessmentModel.findOne({ studentId, assessmentId });
    }

    async getAssessmentResultById(assessmentId: string): Promise<IStudentAssessment | null> {
        try {
            return await StudentAssessmentModel.findOne({ assessmentId })
                .populate('studentId', 'name email')
                .populate('assessmentId', 'title description');
        } catch (error) {
            console.error("Error in fetching assessment result in repository:", error);
            throw new Error("Failed to fetch assessment result");
        }
    }
}
