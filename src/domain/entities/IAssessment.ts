export interface IAssessment {
    _id?: string;
    courseId: string;
    tutorId: string;
    title: string;
    description: string;
    duration: number;
    passingScore: number;
    questions: IQuestion[];
    createdAt?: Date;
    updatedAt?: Date;
}
  
export interface IQuestion {
    _id?: string;
    question: string;
    options: string[];
    correctOption: number;
    marks: number;
}

export interface IStudentAssessment {
    _id?: string;
    studentId: string;
    assessmentId: string;
    responses: IResponse[];
    score: number;
    status: string;
    submittedDate: Date;
}
  
export interface IResponse {
    questionId: string;
    selectedOption: number;
}