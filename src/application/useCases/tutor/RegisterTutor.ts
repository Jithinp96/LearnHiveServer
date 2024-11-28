import bcrypt from 'bcryptjs';

import { ITutorRepository } from '../../../domain/interfaces/ITutorRepository';
import { TutorRegistrationDTO } from '../../dto/TutorRegistrationDTO';
import { generateUniqueId } from '../../../shared/utils/IDService';
import { generateOTP } from '../../../shared/utils/OTPService';
import { OTPModel } from '../../../infrastructure/database/models/OTPModel';
import { sendOTPEmail } from '../../../infrastructure/services/EmailServiceTutor';
import { RegistrationError, TutorAlreadyExistsError } from '../../../domain/errors/TutorError';

export class RegisterTutor {
    constructor(
        private _tutorRepo: ITutorRepository
    ) {}

    async execute(data: TutorRegistrationDTO): Promise<void> {
        try {
            const existingTutor = await this._tutorRepo.findTutorByEmail(data.email);

            if (existingTutor) {
                throw new TutorAlreadyExistsError();
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
                role: 'Tutor',
                education:[],
                subjects:[],
                workExperience:[]
            };

            await this._tutorRepo.createTutor(newTutor);

            const expiredAt = new Date(Date.now() + 60000);
            await OTPModel.create({ email: data.email, otp, expiredAt });

            await sendOTPEmail(data.email, otp);
            // await this._emailService.send(data.email, `Your OTP for registration is: ${otp}`);
        } catch (error) {
            if (error instanceof TutorAlreadyExistsError) {
                throw error;
            }
            throw new RegistrationError();
        }
    }
}