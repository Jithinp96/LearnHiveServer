import { IOTPRepository } from '../../domain/interfaces/IOTPRepository';
import { OTPModel } from '../database/models/OTPModel';

export class OTPRepository implements IOTPRepository {
    async findByEmail(email: string) {
        return await OTPModel.findOne({ email });
    }
    
    async delete(id: string) {
        await OTPModel.deleteOne({ _id: id });
    }
    
    async save(data: { email: string; otp: number; expiredAt: Date }) {
        await OTPModel.create(data);
    }
}
