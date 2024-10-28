export interface IEducation {
    level: string;
    board: string;
    startDate: string;
    endDate: string;
    grade: string;
    institution: string;
}

export interface IEducationWithId extends IEducation {
    _id: string;
}