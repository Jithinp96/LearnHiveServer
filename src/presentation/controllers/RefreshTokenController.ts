import { Request, Response } from "express";
import { JWTService } from "../../infrastructure/services/JWTService";

export class RefreshTokenController {
  public async refresh(req: Request, res: Response): Promise<any> {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    try {
      const payload = JWTService.verifyRefreshToken(refreshToken);
      const newAccessToken = JWTService.generateAccessToken(payload);

      JWTService.setTokens(res, newAccessToken, refreshToken);
      
      res.status(200).json({ message: 'Token refreshed', accessToken: newAccessToken });
    } catch (error) {
      console.error("Error during token refresh:", error);
      JWTService.clearTokens(res);
      res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
  };
}