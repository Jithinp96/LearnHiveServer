import bcrypt from "bcryptjs";

import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { StudentRegistrationDTO } from "../../dto/StudentRegistrationDTO";
import { generateUniqueId } from "../../../shared/utils/IDService";
import { generateOTP } from "../../../shared/utils/OTPService";
import { IStudent } from "../../../domain/entities/user/IStudent";
import { IEmailService } from "../../../domain/interfaces/IEmailService";
import { RegistrationError, StudentAlreadyExistsError } from "../../../domain/errors/StudentError";
import { OTPModel } from "../../../infrastructure/database/models/OTPModel";
import { sendOTPEmail } from "../../../infrastructure/services/EmailServiceTutor";

export class RegisterStudentUseCase {
    constructor(
        private _studentRepo: IStudentRepository,
    ) {}

    async execute(data: StudentRegistrationDTO): Promise<void> {
        try {
            const existingStudent = await this._studentRepo.findStudentByEmail(data.email);
            if (existingStudent) {
                throw new StudentAlreadyExistsError();
            }

            const id = `student-${generateUniqueId()}`;
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const otp = generateOTP();
            console.log("Student OTP: ", otp);
            
            const newStudent: IStudent = {
                studentId: id,
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                password: hashedPassword,
                isVerified: false,
                role: "Student",
                isBlocked: false,
                education: []
            };

            await this._studentRepo.createStudent(newStudent);

            const expiredAt = new Date(Date.now() + 60000);
            await OTPModel.create({ email: data.email, otp, expiredAt });
            await sendOTPEmail(data.email, otp);
        } catch (error) {
            if (error instanceof StudentAlreadyExistsError) {
                throw error;
            }
            throw new RegistrationError();
        }
    }
}
