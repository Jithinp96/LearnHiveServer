import { IStudent } from "../../../domain/entities/user/IStudent";
import { AccountBlockedError, LoginFailed } from "../../../domain/errors/AuthError";
import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { UserRole } from "../../../shared/enums/UserRoleEnum";
import { generateUniqueId } from "../../../shared/utils/IDService";
import { JWTService } from "../../../shared/utils/JWTService";

export class GoogleSignInUseCase {
    constructor(
        private _studentRepo: IStudentRepository
    ) {}

    async execute(email: string, name: string, sub: string) {
        try {
            let student = await this._studentRepo.findStudentByEmail(email)

            if(!student) {
                const id = `student-${generateUniqueId()}`;

                const newStudent: IStudent = {
                    studentId: id,
                    name: name,
                    email: email,
                    mobile: 0,
                    password: '',
                    isVerified: true,
                    role: "Student",
                    isBlocked: false,
                    education: []
                };

                student = await this._studentRepo.createStudent(newStudent)
            }

            if (student?.isBlocked) {
                throw new AccountBlockedError();
            }

            const studentId = student?._id?.toString()
            const payload = { _id: studentId, email: student?.email, role: UserRole.STUDENT };
            
            const accessToken = JWTService.generateAccessToken( payload );
            const refreshToken = JWTService.generateRefreshToken( {payload} );
            
            return { accessToken, refreshToken, student };
        } catch (error) {
            if (error instanceof AccountBlockedError) {
              throw error;
            }
            throw new LoginFailed();
        }
    }
}