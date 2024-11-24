import { ITutor } from "../../../domain/entities/user/ITutor";
import { AccountBlockedError, LoginFailed } from "../../../domain/errors/AuthError";
import { ITutorRepository } from "../../../domain/interfaces/ITutorRepository";
import { UserRole } from "../../../shared/enums/UserRoleEnum";
import { generateUniqueId } from "../../../shared/utils/IDService";
import { JWTService } from "../../../shared/utils/JWTService";


export class GoogleSignInUseCase {
    constructor(
        private _tutorRepo: ITutorRepository
    ) {}

    async execute(email: string, name: string, sub: string) {
        try {
            let tutor = await this._tutorRepo.findTutorByEmail(email)

            if(!tutor) {
                const id = `tutor-${generateUniqueId()}`;

                const newTutor: ITutor = {
                    tutorId: id,
                    name: name,
                    email: email,
                    mobile: 0,
                    password: '',
                    isVerified: true,
                    isBlocked: false,
                    role: "Tutor",
                    education: [],
                    subjects:[],
                    workExperience:[]
                };

                tutor = await this._tutorRepo.createTutor(newTutor)
            }

            if (tutor?.isBlocked) {
                throw new AccountBlockedError();
            }

            const tutorId = tutor?._id?.toString()
            const payload = { _id: tutorId, email: tutor?.email, role: UserRole.TUTOR };
            
            const accessToken = JWTService.generateAccessToken( payload );
            const refreshToken = JWTService.generateRefreshToken( {payload} );
            
            return { accessToken, refreshToken, tutor };
        } catch (error) {
            if (error instanceof AccountBlockedError) {
              throw error;
            }
            throw new LoginFailed();
        }
    }
}