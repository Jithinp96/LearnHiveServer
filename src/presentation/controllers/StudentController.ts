import { Request, Response } from "express";

import { RegisterStudent } from "../../application/useCases/studentUseCases/RegisterStudent";
import { VerifyOTP } from "../../application/useCases/VerifyOTP";
import { MongoStudentRepository } from "../../infrastructure/repositories/MongoStudentRepository";
import { JWTService } from "../../shared/utils/JWTService";
import { LoginStudentUseCase } from "../../application/useCases/studentUseCases/StudentLogin";
import { LogoutStudentUseCase } from "../../application/useCases/studentUseCases/LogoutStudent";

export class StudentController {
  private studentRepo: MongoStudentRepository;
  private registerStudent: RegisterStudent;
  private verifyOTPUseCase: VerifyOTP;
  private loginStudentUseCase: LoginStudentUseCase;
  private jwtService: JWTService

  constructor() {
    this.studentRepo = new MongoStudentRepository();
    this.jwtService= new JWTService()
    this.registerStudent = new RegisterStudent(this.studentRepo);
    this.verifyOTPUseCase = new VerifyOTP(this.studentRepo);
    this.loginStudentUseCase = new LoginStudentUseCase(this.studentRepo, this.jwtService)
  }

  // Register a new student
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, mobile, password } = req.body;
      
      await this.registerStudent.execute({ name, email, mobile, password });
      
      res.cookie("OTPEmail", email, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production'
      })

      res.status(201).json({ message: "Registration successful. OTP sent to email." });
    } catch (error) {
      res.status(500).json({ error: "An error occurred during registration" });
    }
  };

  // Verify OTP for a student
  public verifyOTP = async (req: Request, res: Response) => {
    
    const { otp } = req.body;
    const email = req.cookies.OTPEmail

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false,
        message: "Email and OTP are required",
        error: "INVALID_INPUT"
      });
    }

    try {
      const isVerified = await this.verifyOTPUseCase.execute(email, parseInt(otp));

      if (isVerified) {
        res.clearCookie('OTPEmail');
        return res.status(200).json({ 
          success: true,
          message: "OTP verified successfully!",
          error: null
        });
      } else {
        return res.status(400).json({ 
          success: false,
          message: "Invalid OTP. Please try again!",
          error: "INVALID_OTP"
        });
      }
    } catch (error) {
      console.error("OTP verification failed: ", error);
      res.status(500).json({ 
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
        const { accessToken, refreshToken, student } = await this.loginStudentUseCase.execute(email, password);
        console.log(student);
        
        JWTService.setTokens(res, accessToken, refreshToken, student.role);

        res.status(200).json({
            message: "Login successful",
            student,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(401).json({  error });
    }
  }

  //LOGOUT STUDENT
  public logout = async(req: Request, res: Response) => {
    const role = req.params.role;
    return LogoutStudentUseCase.execute(req, res, role);
  }
}
