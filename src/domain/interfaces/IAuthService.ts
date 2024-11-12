import { UserRole } from "../../shared/enums/UserRoleEnum";

export interface ValidationResult {
    userId: string;
    role: UserRole;
}

export interface RefreshResult {
    accessToken: string;
    role: UserRole;
}

export interface IAuthService {
    validateAccessToken(token: string): Promise<ValidationResult  | null>;
    refreshToken(refreshToken: string): Promise<RefreshResult  | null>;
}