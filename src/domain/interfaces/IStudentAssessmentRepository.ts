import { IStudentAssessment } from "../entities/IAssessment"

export interface IStudentAssessmentRepository {
    submitAssessment(studentAssessment: IStudentAssessment): Promise<IStudentAssessment>
    getStudentAssessment(studentId: string, assessmentId: string): Promise<IStudentAssessment | null>
    getAssessmentResultById(assessmentId: string): Promise<IStudentAssessment | null>
}