import { Request, Response } from "express";

import { RegisterTutor } from "../../application/useCases/tutor/RegisterTutor";
import { VerifyOTPTutor } from "../../application/useCases/VerifyOTP";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";
import { LoginTutorUseCase } from "../../application/useCases/tutor/TutorLogin";
import { JWTService } from "../../shared/utils/JWTService";
import { generateOTP } from "../../shared/utils/OTPService";
import { OTPModel } from "../../infrastructure/database/models/OTPModel";
import { sendOTPEmail } from "../../infrastructure/services/EmailService";
import { HttpStatusEnum } from "../../shared/enums/HttpStatusEnum";
import { ForgotPassword } from "../../application/useCases/tutor/ForgotPassword";
import { ResetPassword } from "../../application/useCases/tutor/ResetPassword";
import { LogoutTutorUseCase } from "../../application/useCases/tutor/LogoutTutorUseCase";

export class TutorController {
    private _tutorRepo: TutorRepository;
    private _registerTutor: RegisterTutor;
    private _verifyOTPUseCase: VerifyOTPTutor;
    private _loginTutorUseCase: LoginTutorUseCase;
    private _jwtService: JWTService;
    private _forgotPasswordUseCase: ForgotPassword;
    private _resetPasswordUseCase: ResetPassword;

    constructor() {
        this._tutorRepo = new TutorRepository();
        this._registerTutor = new RegisterTutor(this._tutorRepo);
        this._verifyOTPUseCase = new VerifyOTPTutor(this._tutorRepo);
        this._jwtService = new JWTService();
        this._loginTutorUseCase = new LoginTutorUseCase(this._tutorRepo, this._jwtService);
        this._forgotPasswordUseCase = new ForgotPassword(this._tutorRepo);
        this._resetPasswordUseCase = new ResetPassword(this._tutorRepo)
    }

    //REGISTER TUTOR
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
          const { name, email, mobile, password } = req.body;
          await this._registerTutor.execute({ name, email, mobile, password });
    
          res.cookie("OTPEmail", email, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
    
          res.status(HttpStatusEnum.CREATED).json({ message: "Registration successful. OTP sent to email." });
        } catch (error) {
          res.status(HttpStatusEnum.BAD_REQUEST).json({ error });
        }
    };

    public resendOTP = async(req: Request, res: Response) => {
        try {
          const email = req.cookies.OTPEmail;
          const otp = generateOTP();
          console.log("Tutor OTP: ", otp);
    
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
    
    //TUTOR OTP VERIFICATION
    public verifyOTP = async (req: Request, res: Response) => {
        const { otp } = req.body;
        const email = req.cookies.OTPEmail;
    
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

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            const { accessToken, refreshToken, tutor } = await this._loginTutorUseCase.execute(email, password)
            JWTService.setTokens(res, accessToken, refreshToken, tutor.role);

            res.status(HttpStatusEnum.OK).json({
                message: "Tutor Login Successful",
                tutor,
            })
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

      public logout = async(req: Request, res: Response) => {
        const role = req.params.role;
        return LogoutTutorUseCase.execute(req, res, role);
      }
}