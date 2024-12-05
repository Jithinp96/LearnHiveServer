import { IStudentAssessment } from "../../domain/entities/IAssessment";
import { IStudentAssessmentRepository } from "../../domain/interfaces/IStudentAssessmentRepository";
import { StudentAssessmentModel } from "../database/models/StudentAssessmentModel";

export class StudentAssessmentRepository implements IStudentAssessmentRepository {
    // async submitAssessment(studentAssessment: IStudentAssessment): Promise<IStudentAssessment> {
    //     try {
    //         return await new StudentAssessmentModel(studentAssessment).save();
    //     } catch (error) {
    //         console.error("Error in submitting assessment:", error);
    //         throw new Error("Failed to submit assessment");
    //     }
    // }

    async submitAssessment(studentAssessment: IStudentAssessment): Promise<IStudentAssessment | null> {
        try {
            // Check if a submission already exists for this student and assessment
            const existingSubmission = await StudentAssessmentModel.findOne({
                studentId: studentAssessment.studentId,
                assessmentId: studentAssessment.assessmentId
            });
    
            // If an existing submission exists, update it
            if (existingSubmission) {
                existingSubmission.responses = studentAssessment.responses;
                existingSubmission.score = studentAssessment.score;
                existingSubmission.status = studentAssessment.status;
                existingSubmission.submittedDate = studentAssessment.submittedDate;
    
                return await existingSubmission.save();
            }
    
            // Create a new submission
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
            const assessmentResult = await StudentAssessmentModel.findOne({ assessmentId })
                .populate('studentId', 'name email')
                .populate({
                    path: 'assessmentId',
                    select: 'tutorId courseId title description passingScore',
                    populate: [
                        {
                            path: 'tutorId',
                            select: 'name'
                        },
                        {
                            path: 'courseId',
                            select: 'title'
                        }
                    ]
                });
            return assessmentResult
        } catch (error) {
            console.error("Error in fetching assessment result in repository:", error);
            throw new Error("Failed to fetch assessment result");
        }
    }
}
