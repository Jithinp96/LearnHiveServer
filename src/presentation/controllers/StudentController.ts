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

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export class StudentController {
  private _studentRepo: StudentRepository;
  private _registerStudent: RegisterStudent;
  private _verifyOTPUseCase: VerifyOTP;
  private _loginStudentUseCase: LoginStudentUseCase;
  private _jwtService: JWTService;
  private _forgotPasswordUseCase: ForgotPassword;
  private _resetPasswordUseCase: ResetPassword;

  constructor() {
    this._studentRepo = new StudentRepository();
    this._jwtService= new JWTService()
    this._registerStudent = new RegisterStudent(this._studentRepo);
    this._verifyOTPUseCase = new VerifyOTP(this._studentRepo);
    this._loginStudentUseCase = new LoginStudentUseCase(this._studentRepo, this._jwtService)
    this._forgotPasswordUseCase = new ForgotPassword(this._studentRepo);
    this._resetPasswordUseCase = new ResetPassword(this._studentRepo)
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
        console.log(student);
        
        JWTService.setTokens(res, accessToken, refreshToken, student.role);

        res.status(HttpStatusEnum.OK).json({
            message: "Login successful",
            student,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(HttpStatusEnum.UNAUTHORIZED).json({  error });
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
    const role = req.params.role;
    return LogoutStudentUseCase.execute(req, res, role);
  }

  //DAHSBOARD
  async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Assuming studentId is set by the middleware after authentication
      const studentId = req.userId;

      if (!studentId) {
        res.status(401).json({ message: 'Unauthorized access' });
        return
      }

      // Fetch student data from repository
      const student = await this._studentRepo.findStudentById(studentId);

      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return
      }

      // Respond with student data (or other dashboard-related info)
      res.status(200).json({
        message: 'Welcome to your dashboard!',
        student,
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

}
