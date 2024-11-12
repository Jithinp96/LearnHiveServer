import { IAssessment } from "../../domain/entities/IAssessment";
import { IAssessmentRepository } from "../../domain/interfaces/IAssessmentRepository";
import { Assessment } from "../database/models/AssessmentModel";
import { CourseOrder } from "../database/models/CourseOrderModel";

export class AssessmentRepository implements IAssessmentRepository {
  async createAssessment(assessment: IAssessment): Promise<IAssessment> {
    try {
      console.log("Inside create assessment in assessment Repository");
      
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

  async getAssessmentsForStudent(studentId: string): Promise<IAssessment[]> {
    try {
      // Find courses purchased by the student and are active
      const purchasedCourses = await CourseOrder.find({
        studentId,
        isActive: true,
        paymentStatus: 'Completed'
      }).select('courseId');

      const courseIds = purchasedCourses.map(order => order.courseId);

      // Fetch assessments linked to these courses
      const assessments =  await Assessment.find({ courseId: { $in: courseIds } })
        .populate('courseId', 'title');
      return assessments
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