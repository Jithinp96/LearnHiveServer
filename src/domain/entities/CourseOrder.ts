export interface CourseOrder {
    _id: string;
    studentId: string;
    courseId: string;
    paymentId: string;
    amount: number;
    paymentStatus: 'pending' | 'completed' | 'failed';
    purchaseDate: Date;
    isActive: boolean;
    completionStatus: 'not-started' | 'in-progress' | 'completed';
    lastAccessedDate: Date;
}