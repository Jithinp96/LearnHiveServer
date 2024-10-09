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

export interface Tutor {
    tutorId: string;
    name: string;
    email: string;
    mobile: number;
    password: string;
    isVerified: boolean;
    isBlocked: boolean;
    role: string;
    subjects: string[];
    education: TutorEducation[];
    workExperience: WorkExperience[];
}