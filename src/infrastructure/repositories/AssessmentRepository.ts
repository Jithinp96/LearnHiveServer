import { IAssessment } from "../../domain/entities/IAssessment";
import { IAssessmentRepository } from "../../domain/interfaces/IAssessmentRepository";
import { Assessment } from "../database/models/AssessmentModel";
import { CourseOrder } from "../database/models/CourseOrderModel";
import { StudentAssessmentModel } from "../database/models/StudentAssessmentModel";

export class AssessmentRepository implements IAssessmentRepository {
  async createAssessment(assessment: IAssessment): Promise<IAssessment> {
    try {
      const newAssessment = new Assessment(assessment);
      return await newAssessment.save();
    } catch (error) {
      console.error("Error in creating assessment from Assessment repository: ", error);
      throw new Error("Failed to create assessment");
    }
  }

  async getAssessmentsByCourse(courseId: string): Promise<IAssessment[]> {
    return await Assessment.find({ courseId })
  }

  async getAssessmentsByTutor(tutorId: string): Promise<IAssessment[]> {
    const assessments =  await Assessment.find({ tutorId })
      .populate('courseId', 'title');
    return assessments
  }

  async getAssessmentsForStudent(studentId: string): Promise<IAssessment[] | null> {
    try {
      const completedCourses = await CourseOrder.find({
        studentId,
        isActive: true,
        paymentStatus: 'Completed',
        completionStatus: 'Completed'
      }).select('courseId');

      const completedCourseIds  = completedCourses.map(order => order.courseId);

      if (completedCourseIds.length === 0) {
        return [];
      }
      
      const assessments = await Assessment.find({ courseId: { $in: completedCourseIds } })
        .populate('courseId', 'title')
        .lean(); // Convert to plain JavaScript object
      
      const assessmentIds = assessments.map((assessment) => assessment._id);
      
      // Find student's assessment attempts
      const studentAssessments = await StudentAssessmentModel.find({
        studentId,
        assessmentId: { $in: assessmentIds }
      }).lean();

      // Map assessments with their status
      const assessmentsWithStatus = assessments.map(assessment => {
        // Find corresponding student assessment
        const studentAssessment = studentAssessments.find(sa => 
          sa.assessmentId.toString() === assessment._id.toString()
        );

        // Determine status
        let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
        if (studentAssessment) {
          status = studentAssessment.status === 'Completed' 
            ? 'completed' 
            : 'in-progress';
        }

        return {
          ...assessment,
          status,
          questions: assessment.questions || [], // Ensure questions array exists
        };
      });

      return assessmentsWithStatus;
    } catch (error) {
      console.error("Error fetching assessments for student:", error);
      throw new Error("Failed to fetch assessments for student");
    }
  }

  // async submitStudentAssessment(studentAssessment: IStudentAssessment): Promise<IStudentAssessment> {
  //   const submission = new StudentAssessment(studentAssessment);
  //   return await submission.save();
  // }

  // async getStudentAssessments(studentId: string): Promise<IStudentAssessment[]> {
  //   return await StudentAssessment.find({ studentId }).populate('assessmentId');
  // }

  async getAssessmentById(assessmentId: string): Promise<IAssessment | null> {
    try {
      return await Assessment.findById(assessmentId);
    } catch (error) {
      console.error("Error fetching assessment by ID:", error);
      throw new Error("Failed to fetch assessment by ID");
    }
  }
}