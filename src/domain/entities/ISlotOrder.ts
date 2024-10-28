export interface ISlotOrder {
    _id: string;
    studentId: string;
    tutorId: string;
    paymentId: string;
    amount: number;
    paymentStatus: 'Pending' | 'Completed' | 'Failed';
    sessionStatus: 'Scheduled' | 'Completed' | 'Cancelled';
    meetingLink?: string;
    notes?: string;
}