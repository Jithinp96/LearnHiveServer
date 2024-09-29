import { IStudentRepository } from "../../domain/interfaces/IStudentRepository";
import { ITutorRepository } from "../../domain/interfaces/ITutorRepository";
import { OTPModel } from "../../infrastructure/database/models/OTPModel";

export class VerifyOTP {
    constructor(private studentRepo: IStudentRepository) {}

    async execute(email:string, otp: number): Promise<boolean> {
        try {
            const student = await this.studentRepo.findStudentByEmail(email);

            if(!student) {
                throw new Error('Student not found!');
            }

            const dbOTP = await OTPModel.findOne({ email, otp })

            if (!dbOTP) {
                throw new Error('Invalid OTP');
            }
    
            if (new Date() > dbOTP.expiresAt) {
                throw new Error('OTP has expired');
            }
        
            student.isVerified = true;
            await this.studentRepo.updateStudent(student);
        
            await OTPModel.deleteOne({ _id: dbOTP._id });
        
            return true;
        } catch (error) {
            console.error('Error during OTP verification: ', error);
            throw error;
        }
    }
}

export class VerifyOTPTutor {
    constructor(private tutorRepo: ITutorRepository) {}

    async execute(email: string, otp: number): Promise<boolean> {
        try {
            const tutor = await this.tutorRepo.findTutorByEmail(email);

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
            await this.tutorRepo.updateTutor(tutor);

            await OTPModel.deleteOne({ _id: dbOTP._id });

            return true;
        } catch (error) {
            console.error('Error during OTP verification: ', error);
            throw error;
        }
    }
}