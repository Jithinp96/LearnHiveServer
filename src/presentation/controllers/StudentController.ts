import { Request, Response } from "express";

import { RegisterStudent } from "../../application/useCases/student/RegisterStudent";
import { VerifyOTP } from "../../application/useCases/VerifyOTP";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { JWTService } from "../../shared/utils/JWTService";
import { LoginStudentUseCase } from "../../application/useCases/student/StudentLogin";
import { LogoutStudentUseCase } from "../../application/useCases/student/LogoutStudent";
import { generateOTP } from "../../shared/utils/OTPService";
import { OTPModel } from "../../infrastructure/database/models/OTPModel";
import { sendOTPEmail } from "../../infrastructure/services/EmailService";
import { HttpStatusEnum } from "../../shared/enums/HttpStatusEnum";
import { ForgotPassword } from "../../application/useCases/student/ForgotPassword";
import { ResetPassword } from "../../application/useCases/student/ResetPassword";
import { StudentUseCase } from "../../application/useCases/student/StudentUseCase";
import { CourseCategoryRepository } from "../../infrastructure/repositories/CourseCategoryRepository";
import { CourseCategoryUseCases } from "../../application/useCases/admin/CourseCategory";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../infrastructure/config/awsS3Config";
import { TutorModel } from "../../infrastructure/database/models/TutorModel";
import { TutorUseCase } from "../../application/useCases/tutor/TutorUseCase";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";
import { TutorSlotRepository } from "../../infrastructure/repositories/TutorSlotRepository";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const courseCategoryRepository = new CourseCategoryRepository();
const courseCategoryUseCases = new CourseCategoryUseCases(courseCategoryRepository);

export class StudentController {
  private _studentRepo: StudentRepository;
  private _registerStudent: RegisterStudent;
  private _verifyOTPUseCase: VerifyOTP;
  private _loginStudentUseCase: LoginStudentUseCase;
  private _jwtService: JWTService;
  private _forgotPasswordUseCase: ForgotPassword;
  private _resetPasswordUseCase: ResetPassword;
  private _courseCategoryUseCases: CourseCategoryUseCases
  private _courseCategoryRepository: CourseCategoryRepository
  private _studentUseCase: StudentUseCase;
  private _tutorUseCase: TutorUseCase;
  private _tutorRepo: TutorRepository;
  private _tutorSlotRepo: TutorSlotRepository;

  constructor() {
    this._studentRepo = new StudentRepository();
    this._jwtService= new JWTService()
    this._registerStudent = new RegisterStudent(this._studentRepo);
    this._verifyOTPUseCase = new VerifyOTP(this._studentRepo);
    this._loginStudentUseCase = new LoginStudentUseCase(this._studentRepo, this._jwtService)
    this._forgotPasswordUseCase = new ForgotPassword(this._studentRepo);
    this._resetPasswordUseCase = new ResetPassword(this._studentRepo);
    this._studentUseCase = new StudentUseCase(this._studentRepo);
    this._courseCategoryRepository = new CourseCategoryRepository();
    this._courseCategoryUseCases= new CourseCategoryUseCases(this._courseCategoryRepository)
    this._tutorRepo = new TutorRepository();
    this._tutorSlotRepo = new TutorSlotRepository();
    this._tutorUseCase = new TutorUseCase(this._tutorRepo, this._tutorSlotRepo);
  }

  // Register a new student
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, mobile, password } = req.body;
      
      await this._registerStudent.execute({ name, email, mobile, password });
      
      res.cookie("OTPEmail", email, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production'
      })

      res.status(HttpStatusEnum.CREATED).json({ message: "Registration successful. OTP sent to email." });
    } catch (error) {
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "An error occurred during registration" });
    }
  };

  public resendOTP = async(req: Request, res: Response) => {
    try {
      const email = req.cookies.OTPEmail;
      const otp = generateOTP();
      console.log("Student OTP: ", otp);

      const dbOTP = await OTPModel.findOne({ email })
      await OTPModel.deleteOne({ _id: dbOTP?._id });

      const expiredAt = new Date(Date.now() + 60000);
      await OTPModel.create({ email: email, otp, expiredAt });

      await sendOTPEmail(email, otp);
      res.status(HttpStatusEnum.CREATED).json({ message: "OTP Resent successful." });
    } catch (error) {
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "An error occurred during otp resend" });
    }
  }

  // Verify OTP for a student
  public verifyOTP = async (req: Request, res: Response) => {
    
    const { otp } = req.body;
    const email = req.cookies.OTPEmail

    if (!email || !otp) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
        success: false,
        message: "Email and OTP are required",
        error: "INVALID_INPUT"
      });
    }

    try {
      const isVerified = await this._verifyOTPUseCase.execute(email, parseInt(otp));

      if (isVerified) {
        res.clearCookie('OTPEmail');
        return res.status(HttpStatusEnum.OK).json({ 
          success: true,
          message: "OTP verified successfully!",
          error: null
        });
      } else {
        return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
          success: false,
          message: "Invalid OTP. Please try again!",
          error: "INVALID_OTP"
        });
      }
    } catch (error) {
      console.error("OTP verification failed: ", error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        message: "Internal server error",
        error: "SERVER_ERROR"
      });
    }
  };

  //LOGIN STUDENT
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
 
    try {
        const { accessToken, refreshToken, student } = await this._loginStudentUseCase.execute(email, password);
        
        JWTService.setTokens(res, accessToken, refreshToken, student.role);

        res.status(HttpStatusEnum.OK).json({
            message: "Login successful",
            student,
        });
    } catch (error) {
          console.log("Error from : ", error, "Over");
        
          res.status(HttpStatusEnum.UNAUTHORIZED).json({
          success: false,
          message: error || "Login failed",
          error: "AuthenticationFailed"
      });
    }
  }

  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      await this._forgotPasswordUseCase.execute(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Reached Reset password controller");
      
      await this._resetPasswordUseCase.execute(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  //LOGOUT STUDENT
  public logout = async(req: Request, res: Response) => {
    console.log("Reached student logout controller");
    
    const role = req.params.role;
    return LogoutStudentUseCase.execute(req, res, role);
  }

  //DAHSBOARD
  async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const studentId = req.userId;
      
      if (!studentId) {
        res.status(401).json({ message: 'Unauthorized access' });
        return
      }

      // Fetch student data from repository
      // const student = await this._studentRepo.findStudentById(studentId);
      const categories = await courseCategoryUseCases.getAllCategories();

      // if (!student) {
      //   res.status(404).json({ message: 'Student not found' });
      //   return
      // }

      // Respond with student data (or other dashboard-related info)
      res.status(200).json({categories});
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public getProfile = async (req: Request, res: Response) => {
    const {id} = req.params;
    console.log("Id from get profile controller: ", id);
    
    try {
      const student = await this._studentRepo.findStudentById(id);
      
      if(!student) {
        return res.status(HttpStatusEnum.NOT_FOUND).json({
          message: "Student details not found"
        })
      }
      res.json(student)
    } catch (error) {
      console.error(error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: "Server error" })
    }
  }

  public addEducation = async(req: Request, res: Response) => {
    const {id} = req.params;
    const { level, board, startDate, endDate, grade, institution }  = req.body;
    
    try {
      const student = await this._studentRepo.findStudentById(id);
      
      if(!student) {
        return res.status(HttpStatusEnum.NOT_FOUND).json({
          message: "Student details not found"
        })
      }

      await this._studentUseCase.addEducation(id, { level, board, startDate, endDate, grade, institution })

    } catch (error) {
      console.error(error);
    }
  }

  public editEducation = async(req: Request, res: Response) => {
    const { id, educationId } = req.params;
    const educationData = req.body;

    try {
      const updatedStudent = await this._studentUseCase.editEducation(id, educationId, educationData);
      res.status(200).json(updatedStudent);
    } catch (error) {
      console.error(error);
    }
    
  }

  public deleteEducation = async(req: Request, res: Response) => {
    const { id, educationId } = req.params;

    try {
        const updatedStudent = await this._studentUseCase.deleteEducation(id, educationId);
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete education" });
    }
  }

  public editProfileName = async(req: Request, res: Response) => {
    const { id, newName } = req.body;
    try {
      const updatedStudent = await this._studentUseCase.editProfileName(id, newName);
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update name" });
    }
  }

  public editMobileNumber = async(req: Request, res: Response) => {
    const { id, newNumber } = req.body;
    
    try {
      const updatedStudent = await this._studentUseCase.editMobileNumber(id, newNumber);
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update name" });
    }
  }

  public fetchTutorDetails = async(req: AuthenticatedRequest, res: Response) => {
    const { tutorId } = req.params
    try {
      const tutor = await TutorModel.findById(tutorId).lean();
      if(!tutor) {
        return res.status(HttpStatusEnum.NOT_FOUND).json({
          message: "Tutor details not found"
        })
      }
      res.json(tutor)
    } catch (error) {
      console.error(error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: "Server error" })
    }
  }
  
  public fetchTutorSlotDetails = async(req: AuthenticatedRequest, res: Response) => {
    const { tutorId } = req.params
    if(!tutorId) {
      res.status(HttpStatusEnum.UNAUTHORIZED).json( {message: 'Unable to find tutor details. Please login again'} )
      return
    }
    try {
      const slots = await this._tutorUseCase.getAllSlotsByTutorId(tutorId);
      res.status(200).json(slots);
    } catch (error) {
      
    }
  }

  public editProfilePicture = async(req: Request, res: Response) => {
    const bucketRegion = process.env.S3_BUCKET_REGION;
    const bucketName = process.env.S3_BUCKET_NAME;

    const{id} = req.params;
    
    if (!req.file) {
        console.log("No file received");
        return res.status(400).json({ error: 'No profile image file provided' });
    }
    const fileName = `${Date.now()}-${req.file.originalname}`;

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params)
    await s3.send(command)

    const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;

    const updatedStudent = await this._studentUseCase.editProfilePic(id, url);
    res.status(200).json(updatedStudent);
  }
}
