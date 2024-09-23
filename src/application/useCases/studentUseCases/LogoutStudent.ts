import { Request, Response } from "express";
import { JWTService } from "../../../shared/utils/JWTService";

export class LogoutStudentUseCase {
    static execute(req: Request, res: Response, role: string) {
        JWTService.clearTokens(res, role);
        return res.status(200).json({ message: 'Logged out successfully' });
    }
}