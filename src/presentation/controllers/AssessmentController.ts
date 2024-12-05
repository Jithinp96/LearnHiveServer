import { Request, Response } from 'express';
import { AssessmentRepository } from '../../infrastructure/repositories/AssessmentRepository';
import { HttpStatusEnum } from '../../shared/enums/HttpStatusEnum';
import { CreateAssessmentUseCase } from '../../application/useCases/assessment/CreateAssessmentUseCase';
import { FetchAssessmentsByTutorUseCase } from '../../application/useCases/assessment/FetchAssessmentByTutorUseCase';
import { FetchAssessmentsForStudentUseCase } from '../../application/useCases/assessment/FetchAssessmentsForStudentUseCase';
import { FetchAssessmentByIdUseCase } from '../../application/useCases/assessment/FetchAssessmentByIdUseCase';
import { SubmitStudentAssessmentUseCase } from '../../application/useCases/assessment/SubmitStudentAssessmentUseCase';
import { StudentAssessmentRepository } from '../../infrastructure/repositories/StudentAssessmentRepository';
import { Auth } from 'aws-sdk/clients/docdbelastic';
import { FetchAssessmentResultByIdUseCase } from '../../application/useCases/assessment/FetchAssessmentResultUseCase';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export class AssessmentController {
  private _createAssessmentUseCase: CreateAssessmentUseCase;
  private _fetchAssessmentByTutorUseCase: FetchAssessmentsByTutorUseCase
  private _fetchAssessmentsForStudentUseCase: FetchAssessmentsForStudentUseCase
  private _fetchAssessmentByIdUseCase: FetchAssessmentByIdUseCase
  private _submitStudentAssessmentUseCase: SubmitStudentAssessmentUseCase
  private _fetchAssessmentResultByIdUseCase: FetchAssessmentResultByIdUseCase

  constructor() {
    const studentAssessmentRepo = new StudentAssessmentRepository();
    const assessmentRepo = new AssessmentRepository();
    this._createAssessmentUseCase = new CreateAssessmentUseCase(assessmentRepo);
    this._fetchAssessmentByTutorUseCase = new FetchAssessmentsByTutorUseCase(assessmentRepo)
    this._fetchAssessmentsForStudentUseCase = new FetchAssessmentsForStudentUseCase(assessmentRepo)
    this._fetchAssessmentByIdUseCase = new FetchAssessmentByIdUseCase(assessmentRepo)
    this._submitStudentAssessmentUseCase = new SubmitStudentAssessmentUseCase(assessmentRepo, studentAssessmentRepo);
    this._fetchAssessmentResultByIdUseCase = new FetchAssessmentResultByIdUseCase(studentAssessmentRepo)
  }
  
  public createAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const tutorId = req.userId;
      if (!tutorId) {
        res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'Unauthorized' });
        return;
      }
      const assessment = await this._createAssessmentUseCase.execute(req.body, tutorId);
      res.status(HttpStatusEnum.CREATED).json(assessment);
    } catch (error) {
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create assessment' });
    }
  };

  public fetchAssessmentsByTutor = async (req: AuthenticatedRequest, res: Response) => {
    console.log("Reached fetchAssessmentsByTutor controller");

    try {
      const tutorId = req.userId;
      if (!tutorId) {
        res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'Unauthorized' });
        return;
      }

      const assessments = await this._fetchAssessmentByTutorUseCase.execute(tutorId);
      res.status(HttpStatusEnum.OK).json(assessments);
    } catch (error) {
      console.error("Error fetching assessments by tutor:", error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch assessments' });
    }
  };

  public fetchAssessmentsForStudent = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = req.userId;
      if (!studentId) {
        res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'Unauthorized' });
        return;
      }

      const assessments = await this._fetchAssessmentsForStudentUseCase.execute(studentId);
      res.status(HttpStatusEnum.OK).json(assessments);
    } catch (error) {
      console.error("Error fetching assessments for student:", error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch assessments for student' });
    }
  };

  public fetchAssessmentById = async (req: Request, res: Response) => {
    try {
      const { assessmentId } = req.params;
      console.log("assessmentId from fetch assessment by id controller: ", assessmentId);

      if (!assessmentId) {
        res.status(HttpStatusEnum.BAD_REQUEST).json({ error: 'Assessment ID is required' });
        return;
      }

      const assessment = await this._fetchAssessmentByIdUseCase.execute(assessmentId);

      if (!assessment) {
        res.status(HttpStatusEnum.NOT_FOUND).json({ error: 'Assessment not found' });
        return;
      }

      res.status(HttpStatusEnum.OK).json(assessment);
    } catch (error) {
      console.error("Error fetching assessment details:", error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch assessment details' });
    }
  };

  public submitAssessment = async (req: AuthenticatedRequest, res: Response) => {
    console.log("Inside submitAssessment in assessment controller");
    
    try {
      const studentId = req.userId;
  
      if (!studentId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const { assessmentId } = req.params
      const { responses } = req.body;
  
      const submissionData = {
        studentId,
        assessmentId,
        responses
      };
      
      const submission = await this._submitStudentAssessmentUseCase.execute(submissionData);
      console.log("submission: ", submission);
      
      if (submission) {
        return res.status(HttpStatusEnum.OK).json(submission);
      } else {
        return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
          error: 'Assessment not passed',
          message: 'You did not meet the passing criteria for this assessment.'
        });
      }
    } catch (error) {
      console.error("Error in submitting assessment:", error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to submit assessment' });
    }
  };

  public fetchAssessmentResultById = async(req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = req.userId;
  
      if (!studentId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
  
      const { assessmentId } = req.params
      
      const assessmentResult = await this._fetchAssessmentResultByIdUseCase.execute(assessmentId);

      if (!assessmentResult) {
        return res.status(404).json({ error: 'Assessment result not found' });
      }
      return res.status(200).json(assessmentResult);
    } catch (error) {
      console.error("Error fetching assessment result:", error);
      res.status(500).json({ error: 'Failed to fetch assessment result' });
    }
  }
  
    // submitAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    //   try {
    //     const { assessmentId, answers } = req.body;
    //     const studentId = req.userId;
        
    //     if (!studentId) {
    //       res.status(401).json({ error: 'Unauthorized' });
    //       return;
    //     }
  
    //     const submission = await this.service.submitAssessment(
    //       assessmentId,
    //       studentId,
    //       answers
    //     );
        
    //     res.status(200).json(submission);
    //   } catch (error) {
    //     if (error instanceof Error && error.message === 'Assessment not found') {
    //       res.status(404).json({ error: 'Assessment not found' });
    //     } else {
    //       res.status(500).json({ error: 'Failed to submit assessment' });
    //     }
    //   }
    // };
  }