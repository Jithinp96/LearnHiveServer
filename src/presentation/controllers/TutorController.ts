import { Request, Response } from "express";

import { RegisterTutor } from "../../application/useCases/tutorUseCases/RegisterTutor";
import { VerifyOTPTutor } from "../../application/useCases/VerifyOTP";
import { MongoTutorRepository } from "../../infrastructure/repositories/MongoTutorRepository";
import { LoginTutorUseCase } from "../../application/useCases/tutorUseCases/TutorLogin";
import { JWTService } from "../../shared/utils/JWTService";

export class TutorController {
    private tutorRepo: MongoTutorRepository;
    private registerTutor: RegisterTutor;
    private verifyOTPUseCase: VerifyOTPTutor;
    private loginTutorUseCase: LoginTutorUseCase;
    private jwtService: JWTService;

    constructor() {
        this.tutorRepo = new MongoTutorRepository();
        this.registerTutor = new RegisterTutor(this.tutorRepo);
        this.verifyOTPUseCase = new VerifyOTPTutor(this.tutorRepo);
        this.jwtService = new JWTService();
        this.loginTutorUseCase = new LoginTutorUseCase(this.tutorRepo, this.jwtService);
    }

    //REGISTER TUTOR
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
          const { name, email, mobile, password } = req.body;
          await this.registerTutor.execute({ name, email, mobile, password });
    
          res.cookie("OTPEmail", email, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
    
          res.status(201).json({ message: "Registration successful. OTP sent to email." });
        } catch (error) {
          res.status(400).json({ error });
        }
    };
    
    //TUTOR OTP VERIFICATION
    public verifyOTP = async (req: Request, res: Response) => {
        const { otp } = req.body;
        const email = req.cookies.OTPEmail;
    
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

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            const { accessToken, refreshToken, tutor } = await this.loginTutorUseCase.execute(email, password)
            JWTService.setTokens(res, accessToken, refreshToken, tutor.role);

            res.status(200).json({
                message: "Tutor Login Successful",
                tutor,
            })
        } catch (error) {
            console.error("Login error:", error);
            res.status(401).json({  error });
        }
    }
}