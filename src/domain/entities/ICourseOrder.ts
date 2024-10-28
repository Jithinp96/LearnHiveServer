export interface ICourseOrder {
    _id: string;
    studentId: string;
    courseId: string;
    paymentId: string;
    amount: number;
    paymentStatus: 'Pending' | 'Completed' | 'Failed';
    purchaseDate: Date;
    isActive: boolean;
    completionStatus: 'Not-Started' | 'In-Progress' | 'Completed';
    lastAccessedDate: Date;
}