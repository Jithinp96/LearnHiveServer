import { Request, Response } from "express";

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

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export class TutorController {
  private _tutorRepo: TutorRepository;
  private _tutorSlotRepo: TutorSlotRepository;
  private _registerTutor: RegisterTutor;
  private _verifyOTPUseCase: VerifyOTPTutor;
  private _loginTutorUseCase: LoginTutorUseCase;
  private _jwtService: JWTService;
  private _forgotPasswordUseCase: ForgotPassword;
  private _resetPasswordUseCase: ResetPassword;
  private _tutorUseCase: TutorUseCase;
  private _saveSlotPreferenceUseCase: SaveSlotPreferenceUseCase;
  private _tutorSlotPreferenceRepository: TutorSlotPreferenceRepository;

  constructor() {
      this._tutorRepo = new TutorRepository();
      this._tutorSlotRepo = new TutorSlotRepository();
      this._tutorSlotPreferenceRepository = new TutorSlotPreferenceRepository();

      this._registerTutor = new RegisterTutor(this._tutorRepo);
      this._verifyOTPUseCase = new VerifyOTPTutor(this._tutorRepo);
      this._jwtService = new JWTService();
      this._loginTutorUseCase = new LoginTutorUseCase(this._tutorRepo, this._jwtService);
      this._forgotPasswordUseCase = new ForgotPassword(this._tutorRepo);
      this._resetPasswordUseCase = new ResetPassword(this._tutorRepo);
      this._tutorUseCase = new TutorUseCase(this._tutorRepo, this._tutorSlotRepo);
      this._saveSlotPreferenceUseCase = new SaveSlotPreferenceUseCase(this._tutorSlotPreferenceRepository)
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
      await this._resetPasswordUseCase.execute(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  public logout = async(req: Request, res: Response) => {
    const role = req.params.role;
    return LogoutTutorUseCase.execute(req, res, role);
  }

  public getProfile = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
      const tutor = await this._tutorRepo.findTutorById(id);

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
      res.status(401).json({ message: 'Unauthorized: Tutor ID is required.' });
      return; 
    }

    try {
        const updatedTutor = await this._tutorUseCase.addSubject(tutorId, subjectData);
        res.status(200).json(updatedTutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to add subject" });
    }
  }

  public editSubject = async (req: AuthenticatedRequest, res: Response) => {
    const tutorId = req.userId;
    const { subjectId, editedSubject } = req.body;
    if(!tutorId) {
      res.status(401).json({ message: 'Unauthorized: Tutor ID is required.' });
      return; 
    }

    try {
        const updatedTutor = await this._tutorUseCase.editSubject(tutorId, subjectId, editedSubject);
        res.status(200).json(updatedTutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to edit subject" });
    }
  }

  public deleteSubject = async (req: AuthenticatedRequest, res: Response) => {
    const tutorId = req.userId;
    const { subjectId } = req.body;

    if(!tutorId) {
      res.status(401).json({ message: 'Unauthorized: Tutor ID is required.' });
      return; 
    }

    try {
        const updatedTutor = await this._tutorUseCase.deleteSubject(tutorId, subjectId);
        res.status(200).json(updatedTutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete subject" });
    }
  }

  public fetchSubjects = async (req: AuthenticatedRequest, res: Response) => {
    const tutorId = req.userId;

    if (!tutorId) {
      res.status(401).json({ message: 'Unauthorized: Tutor ID is required.' });
      return;
    }

    try {
      const subjects = await this._tutorUseCase.fetchSubjects(tutorId);
      res.status(200).json({ subjects });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch subjects' });
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
      res.status(200).json(updatedTutor);
    } catch (error) {
      console.error(error);
    }
    
  }

  public deleteEducation = async(req: Request, res: Response) => {
    const { id, educationId } = req.params;

    try {
        const updatedTutor = await this._tutorUseCase.deleteEducation(id, educationId);
        res.status(200).json(updatedTutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete education" });
    }
  }

  public editProfileName = async(req: Request, res: Response) => {
    const { id, newName } = req.body;
    try {
      const updatedTutor = await this._tutorUseCase.editProfileName(id, newName);
      res.status(200).json(updatedTutor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update name" });
    }
  }

  public editMobileNumber = async(req: Request, res: Response) => {
    const { id, newNumber } = req.body;
    
    try {
      const updatedTutor = await this._tutorUseCase.editMobileNumber(id, newNumber);
      res.status(200).json(updatedTutor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update name" });
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

    const updatedTutor = await this._tutorUseCase.editProfilePic(id, url);
    res.status(200).json(updatedTutor);
  }

  public addSlot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const tutorId = req.userId
    const slotData = req.body;
    const mergedSlotData = { tutorId, ...slotData };
    try {
        const newSlot = await this._tutorUseCase.addSlot(mergedSlotData);
        res.status(201).json(newSlot);
    } catch (error) {
        res.status(400).json({ error: error });
    }
  }

  public editSlot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {slotData, slotId} = req.body;
    try {
        const updatedSlot = await this._tutorUseCase.editSlot(slotId, slotData);
        if (!updatedSlot) {
          res.status(404).json({ message: 'Slot not found' });
          return
        }
        res.status(200).json(updatedSlot);
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

  public getSlotById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const slotId = req.params.slotId;

    try {
        const slot = await this._tutorUseCase.getSlotById(slotId);
        if (!slot) {
          res.status(404).json({ message: 'Slot not found' });
          return
        }
        res.status(200).json(slot);
    } catch (error) {
        res.status(400).json({ error: error });
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
        res.status(200).json(slots);
    } catch (error) {
        res.status(400).json({ error: error });
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
      res.status(201).json({ message: 'Slot preference saved successfully' });
    } catch (error) {
      console.log("error from the save slot preference in tutor controller");
      
      res.status(500).json({ message: 'Failed to save slot preference', error });
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
        
        res.status(200).json({ message: 'Slots generated successfully', newSlots });
    } catch (error) {
        console.error('Error generating slots:', error);
        res.status(500).json({ message: 'Error generating slots' });
    }
  };
}