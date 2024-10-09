import bcrypt from "bcryptjs";

import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { StudentRegistrationDTO } from "../../dto/StudentRegistrationDTO";
import { generateUniqueId } from "../../../shared/utils/IDService";
import { generateOTP } from "../../../shared/utils/OTPService";
import { Student } from "../../../domain/entities/Student";
import { OTPModel } from "../../../infrastructure/database/models/OTPModel";
import { sendOTPEmail } from "../../../infrastructure/services/EmailService";

export class RegisterStudent {
    constructor(private _studentRepo: IStudentRepository) {}

    async execute(data: StudentRegistrationDTO): Promise<void> {
        try {
            const existingStudent = await this._studentRepo.findStudentByEmail(data.email);
            if (existingStudent) {
              throw new Error("Student with this email already exists");
            }
      
            const id = `student-${generateUniqueId()}`
      
            const hashedPassword = await bcrypt.hash(data.password, 10);
      
            const otp = generateOTP();
            console.log("Student OTP: ", otp);
      
            const newStudent: Student = {
              studentId: id,
              name: data.name,
              email: data.email,
              mobile: data.mobile,
              password: hashedPassword,
              isVerified: false,
              role: "student",
              isBlocked: false,
              education:[]
            };
      
            const createdStudent = await this._studentRepo.createStudent(newStudent);
      
            const expiredAt = new Date(Date.now() + 60000);
            await OTPModel.create({ email: data.email, otp, expiredAt });
      
            await sendOTPEmail(data.email, otp);
          } catch (error) {
            console.error("Registration error:", error);
            throw new Error("Registration failed: " + error);
          }
    }
}