import { Request, Response, NextFunction } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { jwtDecode } from "jwt-decode";

import { RegisterStudentUseCase } from "../../application/useCases/student/RegisterStudent";
import { VerifyOTP } from "../../application/useCases/VerifyOTP";
import { LoginStudentUseCase } from "../../application/useCases/student/StudentLogin";
import { GoogleSignInUseCase } from "../../application/useCases/student/GoogleSignInUseCase";
import { LogoutStudentUseCase } from "../../application/useCases/student/LogoutStudent";
import { TutorUseCase } from "../../application/useCases/tutor/TutorUseCase";
import { ForgotPasswordUseCase } from "../../application/useCases/student/ForgotPassword";
import { ResetPasswordUseCase } from "../../application/useCases/student/ResetPassword";
import { StudentUseCase } from "../../application/useCases/student/StudentUseCase";
import { CourseCategoryUseCases } from "../../application/useCases/admin/CourseCategory";
import { ResendOTPUseCase } from "../../application/useCases/student/ResendOTPUseCase";

import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { OTPRepository } from "../../infrastructure/repositories/OTPRepository";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";
import { TutorSlotRepository } from "../../infrastructure/repositories/TutorSlotRepository";
import { CourseCategoryRepository } from "../../infrastructure/repositories/CourseCategoryRepository";

import { JWTService } from "../../shared/utils/JWTService";

import { TutorModel } from "../../infrastructure/database/models/TutorModel";

import { s3 } from "../../infrastructure/config/awsS3Config";

import { HttpStatusEnum } from "../../shared/enums/HttpStatusEnum";
import { SuccessMessageEnum } from "../../shared/enums/SuccessMessageEnum";
import { AuthErrorEnum, StudentErrorEnum } from "../../shared/enums/ErrorMessagesEnum";
import { IGoogleJWT } from "../../domain/entities/user/IGoogleJWT";
import { CourseRepository } from "../../infrastructure/repositories/CourseRepository";
import { OrderRepository } from "../../infrastructure/repositories/OrderRepository";
import { StudentDashboardUseCase } from "../../application/useCases/student/StudentDashboardUseCase";

interface AuthenticatedRequest extends Request {
    userId?: string;
}

const courseCategoryRepository = new CourseCategoryRepository();
const courseCategoryUseCases = new CourseCategoryUseCases(courseCategoryRepository);
const courseRepository = new CourseRepository();
const courseOrderRepository = new OrderRepository();
const getDashboardUseCase = new StudentDashboardUseCase(courseRepository, courseOrderRepository);

export class StudentController {
    private _studentRepo: StudentRepository;
    private _tutorRepo: TutorRepository;
    private _tutorSlotRepo: TutorSlotRepository;
    private _courseCategoryRepo: CourseCategoryRepository;
    private _otpRepo : OTPRepository;
    // private _emailService: EmailService

    private _registerStudentUseCase: RegisterStudentUseCase;
    private _verifyOTPUseCase: VerifyOTP;
    private _loginStudentUseCase: LoginStudentUseCase;
    private _googleSignInUseCase: GoogleSignInUseCase;
    private _jwtService: JWTService;
    private _forgotPasswordUseCase: ForgotPasswordUseCase;
    private _resetPasswordUseCase: ResetPasswordUseCase;
    private _courseCategoryUseCases: CourseCategoryUseCases
    private _studentUseCase: StudentUseCase;
    private _tutorUseCase: TutorUseCase;
    private _resendOTPUseCase: ResendOTPUseCase

    constructor() {
        this._studentRepo = new StudentRepository();
        this._courseCategoryRepo = new CourseCategoryRepository();
        this._tutorRepo = new TutorRepository();
        this._tutorSlotRepo = new TutorSlotRepository();
        this._otpRepo = new OTPRepository()
        // this._emailService = new EmailService()

        this._jwtService= new JWTService()
        this._registerStudentUseCase = new RegisterStudentUseCase(this._studentRepo);
        this._verifyOTPUseCase = new VerifyOTP(this._studentRepo);
        this._loginStudentUseCase = new LoginStudentUseCase(this._studentRepo, this._jwtService)
        this._googleSignInUseCase = new GoogleSignInUseCase(this._studentRepo)
        this._forgotPasswordUseCase = new ForgotPasswordUseCase(this._studentRepo);
        this._resetPasswordUseCase = new ResetPasswordUseCase(this._studentRepo);
        this._studentUseCase = new StudentUseCase(this._studentRepo);
        this._courseCategoryUseCases= new CourseCategoryUseCases(this._courseCategoryRepo)
        this._resendOTPUseCase = new ResendOTPUseCase(this._otpRepo)
        this._tutorUseCase = new TutorUseCase(this._tutorRepo, this._tutorSlotRepo);
        const courseRepo = new CourseRepository();
    }

  // Register a new student
    public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { name, email, mobile, password } = req.body;
            
        try {
            await this._registerStudentUseCase.execute({ name, email, mobile, password });
            
            // res.cookie("OTPEmail", email, {
            //     httpOnly: true,
            //     maxAge: 24 * 60 * 60 * 1000,
            //     secure: process.env.NODE_ENV !== "development"
            // });
            res.cookie("OTPEmail", email, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.status(HttpStatusEnum.CREATED).json({
                success: true,
                message: SuccessMessageEnum.REGISTRATION_SUCCESS
            });
        } catch (error) {
            console.log("Inside register student controller catch: ", error);
            
            next(error);
        }
    };

    public resendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const email = req.cookies.OTPEmail;
            const message = await this._resendOTPUseCase.execute(email);
            res.status(HttpStatusEnum.CREATED).json({ success: true, message });
        } catch (error) {
            next(error);
        }
    };

    // Verify OTP
    public verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        const { otp } = req.body;
        const email = req.cookies.OTPEmail;

        if (!email || !otp) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                success: false,
                message: AuthErrorEnum.EMAIL_OTP_NOT_RECEIVED,
                error: "EMAIL_OTP_NOT_RECEIVED"
            });
        }

        try {
            const isVerified = await this._verifyOTPUseCase.execute(email, parseInt(otp));

            if (isVerified) {
                res.clearCookie('OTPEmail');
                return res.status(HttpStatusEnum.OK).json({
                    success: true,
                    message: SuccessMessageEnum.OTP_VERIFIED,
                    error: null
                });
            }
        } catch (error) {
            next(error);
        }
    };

    // Login student
    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;

        try {
            const { accessToken, refreshToken, student } = await this._loginStudentUseCase.execute(email, password);
            
            JWTService.setTokens(res, accessToken, refreshToken);

            res.status(HttpStatusEnum.OK).json({
                success: true,
                message: SuccessMessageEnum.LOGIN_SUCCESS,
                student
            });
        } catch (error) {
            next(error);
        }
    };

    public googleLogin = async (req: Request, res: Response, next: NextFunction) => {
        const { credentials } = req.body;
        const decoded: IGoogleJWT = jwtDecode(credentials);
        const { name, email, sub } = decoded;

        try {
            const { accessToken, refreshToken, student } = await this._googleSignInUseCase.execute(email, name, sub);

            JWTService.setTokens(res, accessToken, refreshToken);

            res.status(HttpStatusEnum.OK).json({
                success: true,
                message: SuccessMessageEnum.LOGIN_SUCCESS,
                student
            });
        } catch (error) {
            next(error);
        }
    }

    // Forgot password
    public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email } = req.body;

        try {
            await this._forgotPasswordUseCase.execute(email);

            res.status(HttpStatusEnum.OK).json({
                success: true,
                message: SuccessMessageEnum.RESET_PASSWORD_LINK_SENT,
            });
        } catch (error) {
            next(error);
        }
    };

    // Reset password
    public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { token } = req.query;
        const { newPassword } = req.body;

        try {
            await this._resetPasswordUseCase.execute(token as string, newPassword);
            
            res.status(HttpStatusEnum.OK).json({
                success: true,
                message: 'Password successfully reset.',
            });
        } catch (error) {
            next(error);
        }
    };

    // Logout student
    public logout = async(req: Request, res: Response, next: NextFunction) => {
        try {
            await LogoutStudentUseCase.execute(res);
            res.status(HttpStatusEnum.OK).json({
                success: true,
                message: SuccessMessageEnum.LOGOUT_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    };

    //DAHSBOARD
    public getDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(HttpStatusEnum.UNAUTHORIZED).json({
                    success: false,
                    message: 'Invalid student ID.'
                });
            }

            const dashboardData = await getDashboardUseCase.execute(studentId);

            res.status(200).json({
                success: true,
                data: dashboardData
            });
        } catch (error) {
            next(error);
        }
    }


    public getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const studentId = req.userId;
        if (!studentId) {
            return res.status(HttpStatusEnum.UNAUTHORIZED).json({
                success: false,
                message: AuthErrorEnum.INVALID_ID
            });
        }
        try {
            const student = await this._studentUseCase.getProfile(studentId);
            if (!student) {
                return res.status(HttpStatusEnum.NOT_FOUND).json({
                    success: false,
                    message: StudentErrorEnum.STUDENT_NOT_FOUND
                });
            }

            res.status(HttpStatusEnum.OK).json({
                success: true,
                data: student
            });
        } catch (error) {
            next(error);
        }
    };

    public addEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const studentId = req.userId;
        if (!studentId) {
            return res.status(HttpStatusEnum.UNAUTHORIZED).json({
                success: false,
                message: AuthErrorEnum.INVALID_ID
            });
        }
        try {
        const updatedStudent = await this._studentUseCase.addEducation(studentId, req.body);

        res.status(HttpStatusEnum.OK).json({
            success: true,
            message: SuccessMessageEnum.UPDATE_EDUCATION_SUCCESS,
            data: updatedStudent
        });
        } catch (error) {
            next(error);
        }
    };

    public editEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const studentId = req.userId;
        const { educationId } = req.params;
        if (!studentId) {
        return res.status(HttpStatusEnum.UNAUTHORIZED).json({
            success: false,
            message: AuthErrorEnum.INVALID_ID
        });
        }
        
        try {
            const updatedStudent = await this._studentUseCase.editEducation(studentId, educationId, req.body);

            res.status(HttpStatusEnum.OK).json({
                success: true,
                message: SuccessMessageEnum.UPDATE_EDUCATION_SUCCESS,
                data: updatedStudent
            });
        } catch (error) {
            next(error);
        }
    };

    public deleteEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const studentId = req.userId;
        const { educationId } = req.params;
        if (!studentId) {
        return res.status(HttpStatusEnum.UNAUTHORIZED).json({
            success: false,
            message: AuthErrorEnum.INVALID_ID
        });
        }
        try {
            const updatedStudent = await this._studentUseCase.deleteEducation(studentId, educationId);

            res.status(HttpStatusEnum.OK).json({
                success: true,
                message: SuccessMessageEnum.UPDATE_EDUCATION_SUCCESS,
                data: updatedStudent
            });
        } catch (error) {
            next(error);
        }
    };

    public editProfileName = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { id, newName } = req.body;

        try {
            const updatedStudent = await this._studentUseCase.editProfileName(id, newName);

            res.status(HttpStatusEnum.OK).json({
                success: true,
                data: updatedStudent
            });
        } catch (error) {
            next(error);
        }
    };

    public editMobileNumber = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("Reached edit mobile number");
    const studentId = req.userId  
    const { newMobile } = req.body;
    console.log("studentId: ", studentId);
    console.log("newMobile: ", newMobile);
    
    if (!studentId) {
        return res.status(HttpStatusEnum.UNAUTHORIZED).json({
        success: false,
        message: AuthErrorEnum.INVALID_ID
        });
    }
        try {
        const updatedStudent = await this._studentUseCase.editMobileNumber(studentId, newMobile);

        res.status(HttpStatusEnum.OK).json({
            success: true,
            data: updatedStudent
        });
        } catch (error) {
            next(error);
        }
    };

    public editProfilePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.file) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: 'No profile image file provided' });
        }

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;

        try {
            const updatedStudent = await this._studentUseCase.editProfilePic(id, url);

            res.status(HttpStatusEnum.OK).json({
                success: true,
                data: updatedStudent
            });
        } catch (error) {
            next(error);
        }
    };

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

    // public editProfilePicture = async(req: Request, res: Response) => {
    //   const bucketRegion = process.env.S3_BUCKET_REGION;
    //   const bucketName = process.env.S3_BUCKET_NAME;

    //   const{id} = req.params;
        
    //   if (!req.file) {
    //       console.log("No file received");
    //       return res.status(400).json({ error: 'No profile image file provided' });
    //   }
    //   const fileName = `${Date.now()}-${req.file.originalname}`;

    //   const params = {
    //       Bucket: bucketName,
    //       Key: fileName,
    //       Body: req.file.buffer,
    //       ContentType: req.file.mimetype,
    //   };
    //   const command = new PutObjectCommand(params)
    //   await s3.send(command)

    //   const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;

    //   const updatedStudent = await this._studentUseCase.editProfilePic(id, url);
    //   res.status(200).json(updatedStudent);
    // }

  
}
