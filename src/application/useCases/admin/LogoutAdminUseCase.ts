import { Request, Response } from "express";
import { JWTService } from "../../../shared/utils/JWTService";
import { HttpStatusEnum } from "../../../shared/enums/HttpStatusEnum";

export class LogoutAdminUseCase {
    static execute(req: Request, res: Response) {
        try {
            JWTService.clearTokens(res);
            return res.status(HttpStatusEnum.OK).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error("Logout error:", error);
            return res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed', error });
        }
    }
}