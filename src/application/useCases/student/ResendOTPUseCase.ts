import { IOTPRepository } from '../../../domain/interfaces/IOTPRepository';
import { IEmailService } from '../../../domain/interfaces/IEmailService';
import { AuthErrorEnum } from '../../../shared/enums/ErrorMessagesEnum';
import { SuccessMessageEnum } from '../../../shared/enums/SuccessMessageEnum';
import { generateOTP } from '../../../shared/utils/OTPService';

export class ResendOTPUseCase {
    constructor(
        private otpRepository: IOTPRepository,
        private emailService: IEmailService
    ) {}

    async execute(email: string): Promise<string> {
        if (!email) {
            throw new Error(AuthErrorEnum.EMAIL_NOT_RECEIVED);
        }

        const otp = generateOTP();
        const expiredAt = new Date(Date.now() + 60000);

        const dbOTP = await this.otpRepository.findByEmail(email);
        if (dbOTP) {
            await this.otpRepository.delete(dbOTP._id);
        }

        await this.otpRepository.save({ email, otp, expiredAt });
        await this.emailService.send(email, `Your OTP is: ${otp}`);

        return SuccessMessageEnum.OTP_RESENT;
    }
}