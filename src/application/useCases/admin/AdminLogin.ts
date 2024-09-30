import { JWTService } from "../../../shared/utils/JWTService";

export class AdminLogin {
    private _jwtService: JWTService;

    constructor(jwtService: JWTService) {
        this._jwtService = jwtService;
    }

    async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;

            if(email !== adminEmail || password !== adminPassword) {
                throw new Error('Invalid credentials!');
            }

            const payload = { email: adminEmail, role: 'admin' };
            const accessToken = JWTService.generateAccessToken(payload);
            const refreshToken = JWTService.generateRefreshToken(payload);

            return { accessToken, refreshToken }
        } catch (error) {
            console.error("Admin login error:", error);
            throw new Error("Admin login failed: " + error);
        }
    }
}