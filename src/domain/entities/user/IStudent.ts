import { IEducation } from "./IEducation";

export interface IStudent {
    studentId: string;
    name: string;
    email: string;
    mobile: number;
    password: string;
    isVerified: boolean;
    isBlocked: boolean;
    role: string;
    profileImage?:string;
    education: IEducation[];
}