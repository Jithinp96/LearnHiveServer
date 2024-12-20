import { IStudentRepository } from "../../domain/interfaces/IStudentRepository";
import { ITutorRepository } from "../../domain/interfaces/ITutorRepository";
import { OTPModel } from "../../infrastructure/database/models/OTPModel";

import { StudentNotFoundError } from "../../domain/errors/StudentError";
import { OTPExpiredError, InvalidOTPError } from '../../domain/errors/OTPErrors';

export class VerifyOTP {
    constructor(private _studentRepo: IStudentRepository) {}

    async execute(email: string, otp: number): Promise<boolean> {
        const student = await this._studentRepo.findStudentByEmail(email);
        if (!student) {
            throw new StudentNotFoundError();
        }

        const dbOTP = await OTPModel.findOne({ email, otp });
        if (!dbOTP) {
            throw new InvalidOTPError();
        }

        if (new Date() > dbOTP.expiresAt) {
            throw new OTPExpiredError();
        }

        student.isVerified = true;
        await this._studentRepo.updateStudent(student);
        await OTPModel.deleteOne({ _id: dbOTP._id });

        return true;
    }
}


export class VerifyOTPTutor {
    constructor(private _tutorRepo: ITutorRepository) {}

    async execute(email: string, otp: number): Promise<boolean> {
        try {
            const tutor = await this._tutorRepo.findTutorByEmail(email);

            if (!tutor) {
                throw new Error('Tutor not found!');
            }

            const dbOTP = await OTPModel.findOne({ email, otp });

            if (!dbOTP) {
                throw new Error('Invalid OTP');
            }

            if (new Date() > dbOTP.expiresAt) {
                throw new Error('OTP has expired');
            }

            tutor.isVerified = true;
            await this._tutorRepo.updateTutor(tutor);

            await OTPModel.deleteOne({ _id: dbOTP._id });

            return true;
        } catch (error) {
            console.error('Error during OTP verification: ', error);
            throw error;
        }
    }
}