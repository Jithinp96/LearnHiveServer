import bcrypt from 'bcryptjs';

import { ITutorRepository } from '../../../domain/interfaces/ITutorRepository';
import { TutorRegistrationDTO } from '../../dto/TutorRegistrationDTO';
import { generateOTP } from '../../../shared/utils/OTPService';
import { OTPModel } from '../../../infrastructure/database/models/OTPModel';
import { sendOTPEmail } from '../../../infrastructure/services/EmailService';
import { generateUniqueId } from '../../../shared/utils/IDService';

export class RegisterTutor {
    constructor(private _tutorRepo: ITutorRepository) {}

    async execute(data: TutorRegistrationDTO): Promise<void> {
        try {
            const existingTutor = await this._tutorRepo.findTutorByEmail(data.email);

            if (existingTutor) {
                throw new Error("Tutor with this email already exists");
            }

            const id = `tutor-${generateUniqueId()}`;
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const otp = generateOTP();
            console.log("Tutor OTP: ", otp);

            const newTutor = {
                tutorId: id,
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                password: hashedPassword,
                isVerified: false,
                isBlocked: false,
                role: 'tutor',
                education:[],
                subjects:[],
                workExperience:[]
            };

            const createdTutor = await this._tutorRepo.createTutor(newTutor);

            const expiredAt = new Date(Date.now() + 60000);
            await OTPModel.create({ email: data.email, otp, expiredAt });

            await sendOTPEmail(data.email, otp);
        } catch (error) {
            console.error("Error in RegisterTutor:", error);
            throw new Error("Tutor registration failed" + error);
        }
    }
}