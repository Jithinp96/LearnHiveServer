import { IAssessment, IStudentAssessment } from "../entities/IAssessment";

export interface IAssessmentRepository {
    createAssessment(assessment: IAssessment): Promise<IAssessment>;
    getAssessmentsByCourse(courseId: string): Promise<IAssessment[]>;
    getAssessmentsByTutor(tutorId: string): Promise<IAssessment[]>;
    // submitStudentAssessment(studentAssessment: IStudentAssessment): Promise<IStudentAssessment>;
    // getStudentAssessments(studentId: string): Promise<IStudentAssessment[]>;
    getAssessmentsForStudent(studentId: string): Promise<IAssessment[] | null>;
    getAssessmentById(assessmentId: string): Promise<IAssessment | null>;
}