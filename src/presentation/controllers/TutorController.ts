import { NextFunction, Request, Response } from "express";

import { RegisterTutor } from "../../application/useCases/tutor/RegisterTutor";
import { VerifyOTPTutor } from "../../application/useCases/VerifyOTP";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";
import { LoginTutorUseCase } from "../../application/useCases/tutor/TutorLogin";
import { JWTService } from "../../shared/utils/JWTService";
import { generateOTP } from "../../shared/utils/OTPService";
import { OTPModel } from "../../infrastructure/database/models/OTPModel";
import { sendOTPEmail } from "../../infrastructure/services/EmailServiceTutor";
import { HttpStatusEnum } from "../../shared/enums/HttpStatusEnum";
import { ForgotPassword } from "../../application/useCases/tutor/ForgotPassword";
import { ResetPassword } from "../../application/useCases/tutor/ResetPassword";
import { LogoutTutorUseCase } from "../../application/useCases/tutor/LogoutTutorUseCase";
import { TutorUseCase } from "../../application/useCases/tutor/TutorUseCase";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../infrastructure/config/awsS3Config";
import { TutorSlotRepository } from "../../infrastructure/repositories/TutorSlotRepository";
import { SaveSlotPreferenceUseCase } from "../../application/useCases/tutor/SaveSlotPreferenceUseCase";
import { TutorSlotPreferenceRepository } from "../../infrastructure/repositories/TutorSlotPreferenceRepository";
import { MultipleSlotSchedulerRepository } from "../../infrastructure/repositories/MultipleSlotSchedulerRepository";
import { GenerateMultipleSlotUseCase } from "../../application/useCases/tutor/GenerateMultipleSlotUseCase";
import { GetTutorDashboardUseCase } from "../../application/useCases/tutor/GetTutorDashboardUseCase";
import { OrderRepository } from "../../infrastructure/repositories/OrderRepository";
import { TutorDashboardRepository } from "../../infrastructure/repositories/TutorDashboardRepository";
import { IGoogleJWT } from "../../domain/entities/user/IGoogleJWT";
import { jwtDecode } from "jwt-decode";
import { SuccessMessageEnum } from "../../shared/enums/SuccessMessageEnum";
import { GoogleSignInUseCase } from "../../application/useCases/tutor/GoogleSignInUseCase";
// import { EmailService } from "../../infrastructure/services/EmailServiceTutor";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export class TutorController {
  private _tutorRepo: TutorRepository;
  private _tutorSlotRepo: TutorSlotRepository;
  private _tutorSlotPreferenceRepository: TutorSlotPreferenceRepository;
  private _tutorDashboardRepo: TutorDashboardRepository;

  private _registerTutor: RegisterTutor;
  private _verifyOTPUseCase: VerifyOTPTutor;
  private _loginTutorUseCase: LoginTutorUseCase;
  private _googleSignInUseCase: GoogleSignInUseCase;

  private _jwtService: JWTService;
  // private _emailService: EmailService

  private _forgotPasswordUseCase: ForgotPassword;
  private _resetPasswordUseCase: ResetPassword;
  private _tutorUseCase: TutorUseCase;
  private _saveSlotPreferenceUseCase: SaveSlotPreferenceUseCase;
  private _getTutorDashboardUseCase: GetTutorDashboardUseCase

  constructor() {
      this._tutorRepo = new TutorRepository();
      this._tutorSlotRepo = new TutorSlotRepository();
      this._tutorSlotPreferenceRepository = new TutorSlotPreferenceRepository();
      this._tutorDashboardRepo = new TutorDashboardRepository()

      this._jwtService = new JWTService();
      // this._emailService = new EmailService()

      this._registerTutor = new RegisterTutor(this._tutorRepo);
      this._verifyOTPUseCase = new VerifyOTPTutor(this._tutorRepo);
      this._loginTutorUseCase = new LoginTutorUseCase(this._tutorRepo, this._jwtService);
      this._googleSignInUseCase = new GoogleSignInUseCase(this._tutorRepo)
      this._forgotPasswordUseCase = new ForgotPassword(this._tutorRepo);
      this._resetPasswordUseCase = new ResetPassword(this._tutorRepo);
      this._tutorUseCase = new TutorUseCase(this._tutorRepo, this._tutorSlotRepo);
      this._saveSlotPreferenceUseCase = new SaveSlotPreferenceUseCase(this._tutorSlotPreferenceRepository)
      this._getTutorDashboardUseCase = new GetTutorDashboardUseCase(this._tutorDashboardRepo)
    }

  //REGISTER TUTOR
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, mobile, password } = req.body;
      try {
        await this._registerTutor.execute({ name, email, mobile, password });
  
        res.cookie("OTPEmail", email, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV !== "development"
        });
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
        next(error)
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

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    
    try {
        const { accessToken, refreshToken, tutor } = await this._loginTutorUseCase.execute(email, password)
        JWTService.setTokens(res, accessToken, refreshToken);

        res.status(HttpStatusEnum.OK).json({
            message: "Tutor Login Successful",
            tutor,
        })
    } catch (error) {
        next(error)
    }
  }

  public googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { credentials } = req.body;
    const decoded: IGoogleJWT = jwtDecode(credentials);
    const { name, email, sub } = decoded;

    try {
        const { accessToken, refreshToken, tutor } = await this._googleSignInUseCase.execute(email, name, sub);

        JWTService.setTokens(res, accessToken, refreshToken);

        res.status(HttpStatusEnum.OK).json({
            success: true,
            message: SuccessMessageEnum.LOGIN_SUCCESS,
            tutor
        });
    } catch (error) {
        next(error);
    }
}

  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      await this._forgotPasswordUseCase.execute(req, res);
    } catch (error) {
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  };
  
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      await this._resetPasswordUseCase.execute(req, res);
    } catch (error) {
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  };

  public logout = async(req: Request, res: Response, next: NextFunction) => {
    try {
      await LogoutTutorUseCase.execute(res);
      res.status(HttpStatusEnum.OK).json({
        success: true,
        message: SuccessMessageEnum.LOGOUT_SUCCESS
      });
    } catch (error) {
      next(error);
    }
  }

  public getDashboard = async (req: AuthenticatedRequest, res: Response) => {
    const tutorId = req.userId;

    if (!tutorId) {
        res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
        return;
    }

    try {
        const dashboardData = await this._getTutorDashboardUseCase.execute(tutorId);
        res.status(HttpStatusEnum.OK).json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch dashboard data. Please try again later.' });
    }
};

  public getProfile = async (req: AuthenticatedRequest, res: Response) => {
    const tutorId = req.userId;

    if(!tutorId) {
      res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
      return; 
    }
    
    try {
      const tutor = await this._tutorRepo.findTutorById(tutorId);

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

  public addSubject = async (req: AuthenticatedRequest, res: Response) => {
    const tutorId = req.userId;
    const { subjectData } = req.body;
    
    if(!tutorId) {
      res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
      return; 
    }

    try {
        const updatedTutor = await this._tutorUseCase.addSubject(tutorId, subjectData);
        res.status(HttpStatusEnum.OK).json(updatedTutor);
    } catch (error) {
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to add subject" });
    }
  }

  public editSubject = async (req: AuthenticatedRequest, res: Response) => {
    const tutorId = req.userId;
    const { subjectId, editedSubject } = req.body;
    if(!tutorId) {
      res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
      return; 
    }

    try {
        const updatedTutor = await this._tutorUseCase.editSubject(tutorId, subjectId, editedSubject);
        res.status(HttpStatusEnum.OK).json(updatedTutor);
    } catch (error) {
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to edit subject" });
    }
  }

  public deleteSubject = async (req: AuthenticatedRequest, res: Response) => {
    const tutorId = req.userId;
    const { subjectId } = req.body;

    if(!tutorId) {
      res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
      return; 
    }

    try {
        const updatedTutor = await this._tutorUseCase.deleteSubject(tutorId, subjectId);
        res.status(HttpStatusEnum.OK).json(updatedTutor);
    } catch (error) {
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete subject" });
    }
  }

  public fetchSubjects = async (req: AuthenticatedRequest, res: Response) => {
    const tutorId = req.userId;

    if (!tutorId) {
      res.status(HttpStatusEnum.UNAUTHORIZED).json({ message: 'Unauthorized: Tutor ID is required.' });
      return;
    }

    try {
      const subjects = await this._tutorUseCase.fetchSubjects(tutorId);
      res.status(HttpStatusEnum.OK).json({ subjects });
    } catch (error) {
      console.error(error);
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch subjects' });
    }
};


  public addEducation = async(req: Request, res: Response) => {
    const {id} = req.params;
    const { level, board, startDate, endDate, grade, institution }  = req.body;

    try {
      const tutor = await this._tutorRepo.findTutorById(id);
      if(!tutor) {
        return res.status(HttpStatusEnum.NOT_FOUND).json({
          message: "Tutor details not found"
        })
      }

      await this._tutorUseCase.addEducation(id, { level, board, startDate, endDate, grade, institution })
    } catch (error) {
      console.error(error);
    }
  }

  public editEducation = async(req: Request, res: Response) => {
    const { id, educationId } = req.params;
    const educationData = req.body;

    try {
      const updatedTutor = await this._tutorUseCase.editEducation(id, educationId, educationData);
      res.status(HttpStatusEnum.OK).json(updatedTutor);
    } catch (error) {
      console.error(error);
    }
    
  }

  public deleteEducation = async(req: Request, res: Response) => {
    const { id, educationId } = req.params;

    try {
        const updatedTutor = await this._tutorUseCase.deleteEducation(id, educationId);
        res.status(HttpStatusEnum.OK).json(updatedTutor);
    } catch (error) {
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete education" });
    }
  }

  public editProfileName = async(req: Request, res: Response) => {
    const { id, newName } = req.body;
    try {
      const updatedTutor = await this._tutorUseCase.editProfileName(id, newName);
      res.status(HttpStatusEnum.OK).json(updatedTutor);
    } catch (error) {
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to update name" });
    }
  }

  public editMobileNumber = async(req: Request, res: Response) => {
    const { id, newNumber } = req.body;
    
    try {
      const updatedTutor = await this._tutorUseCase.editMobileNumber(id, newNumber);
      res.status(HttpStatusEnum.OK).json(updatedTutor);
    } catch (error) {
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: "Failed to update name" });
    }
  }

  public editProfilePicture = async(req: Request, res: Response) => {
    const bucketRegion = process.env.S3_BUCKET_REGION;
    const bucketName = process.env.S3_BUCKET_NAME;

    const{id} = req.params;
    
    if (!req.file) {
        console.log("No file received");
        return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: 'No profile image file provided' });
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

    const updatedTutor = await this._tutorUseCase.editProfilePic(id, url);
    res.status(HttpStatusEnum.OK).json(updatedTutor);
  }

  public addSlot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const tutorId = req.userId
    const slotData = req.body;
    const mergedSlotData = { tutorId, ...slotData };
    try {
        const newSlot = await this._tutorUseCase.addSlot(mergedSlotData);
        res.status(HttpStatusEnum.CREATED).json(newSlot);
    } catch (error) {
        res.status(HttpStatusEnum.BAD_REQUEST).json({ error: error });
    }
  }

  public editSlot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {slotData, slotId} = req.body;
    try {
        const updatedSlot = await this._tutorUseCase.editSlot(slotId, slotData);
        if (!updatedSlot) {
          res.status(HttpStatusEnum.NOT_FOUND).json({ message: 'Slot not found' });
          return
        }
        res.status(HttpStatusEnum.OK).json(updatedSlot);
    } catch (error) {
        res.status(HttpStatusEnum.BAD_REQUEST).json({ error: error });
    }
}

  public getSlotById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const slotId = req.params.slotId;

    try {
        const slot = await this._tutorUseCase.getSlotById(slotId);
        if (!slot) {
          res.status(HttpStatusEnum.NOT_FOUND).json({ message: 'Slot not found' });
          return
        }
        res.status(HttpStatusEnum.OK).json(slot);
    } catch (error) {
        res.status(HttpStatusEnum.BAD_REQUEST).json({ error: error });
    }
  }

  public getAllSlotsByTutorId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const tutorId = req.userId;
    if(!tutorId) {
      res.status(HttpStatusEnum.UNAUTHORIZED).json( {message: 'Unable to find tutor details. Please login again'} )
      return
    }
    try {
        const slots = await this._tutorUseCase.getAllSlotsByTutorId(tutorId);
        res.status(HttpStatusEnum.OK).json(slots);
    } catch (error) {
        res.status(HttpStatusEnum.BAD_REQUEST).json({ error: error });
    }
  }

  public saveSlotPreference = async(req: AuthenticatedRequest, res: Response) => {
    try {
      console.log("Reached inside save preference constroller");
      
      const {tutorId, subject, level, date, startTime, endTime, price, requiresDailySlotCreation } = req.body;
      const saveData = {
        tutorId: tutorId,
        subject: subject,
        level: level,
        endDate: date,
        startTime: startTime,
        endTime: endTime,
        price: price,
        requiresDailySlotCreation: requiresDailySlotCreation
      }
      const slots = await this._saveSlotPreferenceUseCase.execute(saveData);
      res.status(HttpStatusEnum.CREATED).json({ message: 'Slot preference saved successfully' });
    } catch (error) {
      console.log("error from the save slot preference in tutor controller");
      
      res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Failed to save slot preference', error });
    }
  }

  public multipleSlotGeneration = async (req: Request, res: Response) => {
    console.log("Reached GenerateSlot controller");
    
    try {
        const { tutorId, subject, date, level, startTime, endTime, price } = req.body;
        
        const multipleSlotSchedulerRepository = new MultipleSlotSchedulerRepository();
        const generateMultipleSlotUseCase = new GenerateMultipleSlotUseCase(multipleSlotSchedulerRepository);
        
        const newSlots = await generateMultipleSlotUseCase.execute(
            tutorId,
            subject,
            level,
            date,
            startTime,
            endTime,
            price
        );
        console.log("newSlots: ", newSlots);
        
        res.status(HttpStatusEnum.OK).json({ message: 'Slots generated successfully', newSlots });
    } catch (error) {
        console.error('Error generating slots:', error);
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Error generating slots' });
    }
  };
}