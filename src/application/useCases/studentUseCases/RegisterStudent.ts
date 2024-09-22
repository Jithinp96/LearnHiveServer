import bcrypt from "bcryptjs";

import { StudentRepository } from "../../../domain/interfaces/StudentRepository";
import { StudentRegistrationDTO } from "../../dto/StudentRegistrationDTO";
import { generateOTP } from "../../../shared/utils/OTPService";
import { sendOTPEmail } from "../../../infrastructure/services/EmailService";
import { OTPModel } from "../../../infrastructure/database/models/OTPModel";
import { Student } from "../../../domain/entities/Student";

export class RegisterStudent {
  constructor(private studentRepo: StudentRepository) {}

  async execute(data: StudentRegistrationDTO): Promise<void> {
    
    const existingStudent = await this.studentRepo.findStudentByEmail(
      data.email
    );
    if (existingStudent) {
      throw new Error("Student with this email already exists");
    }

    const generateUniqueId = () => {
      return `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const id = generateUniqueId()

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const otp = generateOTP();
    console.log("Student OTP: ", otp);

    const newStudent = {
      studentId: id,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      password: hashedPassword,
      isVerified: false,
      role: "student",
      isBlocked: false,
      createdAt: new Date()
    };

    const createdStudent = await this.studentRepo.createStudent(newStudent);

    const expiredAt = new Date(Date.now() + 60000);
    await OTPModel.create({ email: data.email, otp, expiredAt });

    // await sendOTPEmail(data.email, otp);
  }
}
