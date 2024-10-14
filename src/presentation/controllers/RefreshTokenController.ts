import { Request, Response } from "express";
import { JWTService } from "../../shared/utils/JWTService";
import { HttpStatusEnum } from "../../shared/enums/HttpStatusEnum";

// export class RefreshTokenController {
//   public async refresh(req: Request, res: Response): Promise<any> {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//       return res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'No refresh token provided' });
//     }

//     try {
//       const payload = JWTService.verifyRefreshToken(refreshToken);
//       const newAccessToken = JWTService.generateAccessToken(payload);

//       // JWTService.setTokens(res, newAccessToken, refreshToken);
      
//       res.status(HttpStatusEnum.OK).json({ message: 'Token refreshed', accessToken: newAccessToken });
//     } catch (error) {
//       console.error("Error during token refresh:", error);
//       // JWTService.clearTokens(res);
//       res.status(HttpStatusEnum.FORBIDDEN).json({ error: 'Invalid or expired refresh token' });
//     }
//   };
// }