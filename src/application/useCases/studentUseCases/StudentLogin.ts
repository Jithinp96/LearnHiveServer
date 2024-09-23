import { StudentRepository } from "../../../domain/interfaces/StudentRepository";
import { JWTService } from "../../../shared/utils/JWTService";
import bcrypt from 'bcryptjs';

export class LoginStudentUseCase {
    
    private studentRepo: StudentRepository;
    private jwtService: JWTService;

    constructor(studentRepo: StudentRepository, jwtService: JWTService) {
        this.studentRepo = studentRepo;
        this.jwtService = jwtService;
    }

    async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; student: any }> {
        const student = await this.studentRepo.findStudentByEmail(email);
        // console.log(student);
        
        if (!student) {
            throw new Error("Invalid email or password");
        }

        if (student.isBlocked) {
            throw new Error("Your account is blocked");
        }

        if (!student.isVerified) {
            throw new Error("Your account is not verified");
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const payload = { id: student.studentId, role: student.role };

        const accessToken = JWTService.generateAccessToken(payload)
        const refreshToken = JWTService.generateRefreshToken(payload);

        return { accessToken, refreshToken, student };
    }
}