import { Request, Response } from "express";
import { JWTService } from "../../../shared/utils/JWTService";
import { HttpStatusEnum } from "../../../shared/enums/HttpStatusEnum";

export class LogoutAdminUseCase {
    static execute(res: Response) {
        try {
            JWTService.clearTokens(res);
        } catch (error) {
            throw new Error('Logout failed. Please try again!');
        }
    }
}