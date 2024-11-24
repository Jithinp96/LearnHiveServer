import { AccountBlockedError, AccountNotVerifiedError, InvalidCredentialsError, LoginFailed } from "../../../domain/errors/AuthError";
import { ITutorRepository } from "../../../domain/interfaces/ITutorRepository";
import { UserRole } from "../../../shared/enums/UserRoleEnum";
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
                throw new InvalidCredentialsError();
            }

            if (tutor.isBlocked) {
                throw new AccountBlockedError();
            }

            if (!tutor.isVerified) {
                throw new AccountNotVerifiedError();
            }

            const isMatch = await bcrypt.compare(password, tutor.password);
            if (!isMatch) {
                throw new InvalidCredentialsError();
            }

            const payload = { _id: tutor._id, email: tutor.email, role: UserRole.TUTOR };
            
            const accessToken = JWTService.generateAccessToken( payload );
            const refreshToken = JWTService.generateRefreshToken( {payload} );

            // const accessToken = JWTService.generateAccessToken( tutor );
            // const refreshToken = JWTService.generateRefreshToken({ tutor });

            return { accessToken, refreshToken, tutor };
        } catch (error) {
            if (error instanceof InvalidCredentialsError ||
                error instanceof AccountBlockedError ||
                error instanceof AccountNotVerifiedError) {
              throw error;
            }
            throw new LoginFailed();
        }
    }
}