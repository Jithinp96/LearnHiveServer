import { ITutorRepository } from "../../../domain/interfaces/ITutorRepository";
import { JWTService } from "../../../shared/utils/JWTService";
import bcrypt from 'bcryptjs';

export class LoginTutorUseCase {
    private _tutorRepo: ITutorRepository;
    private _jwtService: JWTService;

    constructor(tutorRepo: ITutorRepository, jwtService: JWTService) {
        this._tutorRepo = tutorRepo;
        this._jwtService = jwtService;
    }

    async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; tutor: any}> {
        try {
            const tutor = await this._tutorRepo.findTutorByEmail(email);
            
            if (!tutor) {
                throw new Error("Invalid email or password");
            }

            if (tutor.isBlocked) {
                throw new Error("Your account is blocked");
            }

            if (!tutor.isVerified) {
                throw new Error("Your account is not verified");
            }

            const isMatch = await bcrypt.compare(password, tutor.password);
            if (!isMatch) {
                throw new Error("Invalid email or password");
            }

            const accessToken = JWTService.generateTutorAccessToken( tutor );
            const refreshToken = JWTService.generateTutorRefreshToken({ tutor });

            return { accessToken, refreshToken, tutor };
        } catch (error) {
            console.error("Tutor Login error:", error);
            throw new Error("Tutor Login Failed");
        }
    }
}