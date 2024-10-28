export interface IOTPRepository {
    findByEmail(email: string): Promise<any>;
    delete(id: string): Promise<void>;
    save(data: { email: string; otp: number; expiredAt: Date }): Promise<void>;
}