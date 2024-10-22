export interface TutorEducation {
    level: string;
    board: string;
    startDate: string;
    endDate: string;
    grade: string;
    institution: string;
}

export interface WorkExperience {
    institution: string;
    designation: string;
    startDate: string;
    endDate: string;
}

export interface Subjects {
    name: string;
    level: string
}

export interface Tutor {
    tutorId: string;
    name: string;
    email: string;
    mobile: number;
    password: string;
    isVerified: boolean;
    isBlocked: boolean;
    role: string;
    profileImage?:string;
    subjects: Subjects[];
    education: TutorEducation[];
    workExperience: WorkExperience[];
}