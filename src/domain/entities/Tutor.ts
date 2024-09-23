export interface Tutor {
    tutorId: string;
    name: string;
    email: string;
    mobile: number;
    password: string;
    isVerified: boolean;
    isBlocked: boolean;
    role: string;
    createdAt: Date;
}