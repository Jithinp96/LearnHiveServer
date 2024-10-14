import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { JWTService } from "../../../shared/utils/JWTService";
import bcrypt from 'bcryptjs';

export class LoginStudentUseCase {
    
    private _studentRepo: IStudentRepository;
    private _jwtService: JWTService;

    constructor(studentRepo: IStudentRepository, jwtService: JWTService) {
        this._studentRepo = studentRepo;
        this._jwtService = jwtService;
    }

    async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; student: any }> {
        try {
            const student = await this._studentRepo.findStudentByEmail(email);
        
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

            const accessToken = JWTService.generateAccessToken( student )
            const refreshToken = JWTService.generateRefreshToken({ student });
            
            return { accessToken, refreshToken, student };
        } catch (error) {
            throw new Error("Login Failed");
        }
    }
}