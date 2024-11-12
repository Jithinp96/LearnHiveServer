import { IEducation } from "./IEducation";
import { ISubjects } from "./ISubjects";
import { IWorkExperience } from "./IWorkExperience";

export interface ITutor {
    _id?: string
    tutorId: string;
    name: string;
    email: string;
    mobile: number;
    password: string;
    isVerified: boolean;
    isBlocked: boolean;
    role: string;
    profileImage?:string;
    subjects: ISubjects[];
    education: IEducation[];
    workExperience: IWorkExperience[];
}