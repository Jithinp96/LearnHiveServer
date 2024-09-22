import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

import { RegisterStudent } from "../../application/useCases/studentUseCases/RegisterStudent";
import { VerifyOTP } from "../../application/useCases/VerifyOTP";
import { MongoStudentRepository } from "../../infrastructure/repositories/MongoStudentRepository";
import { generateAccessToken, generateRefreshToken } from "../../shared/utils/JWTService";

export class StudentController {
  private studentRepo: MongoStudentRepository;
  private registerStudent: RegisterStudent;
  private verifyOTPUseCase: VerifyOTP;

  constructor() {
    this.studentRepo = new MongoStudentRepository();
    this.registerStudent = new RegisterStudent(this.studentRepo);
    this.verifyOTPUseCase = new VerifyOTP(this.studentRepo);
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
  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const student = await this.studentRepo.findStudentByEmail(email);
      console.log(student);
      

      if(!student) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if(student.isBlocked) {
        return res.status(403).json({ message: "Your account is blocked" })
      }

      if(!student.isVerified) {
        return res.status(403).json({ message: "Your account is not verified" })
      }

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const accessToken = generateAccessToken(student.studentId);
      const refreshToken = generateRefreshToken(student.studentId);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // maxAge: 3600 * 1000, // 1 hour
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        message: "Login Successfull",
        student,
      })

    } catch (error) {
      console.error("Login error: ", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}
