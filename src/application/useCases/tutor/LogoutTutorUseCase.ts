import { Response } from "express";
import { JWTService } from "../../../shared/utils/JWTService";

export class LogoutTutorUseCase {
    static execute(res: Response) {
        try {
            JWTService.clearTokens(res);
        } catch (error) {
            throw new Error('Logout failed. Please try again!');
        }
    }
}