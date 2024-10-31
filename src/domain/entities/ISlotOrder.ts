export interface ISlotOrder {
    _id: string;
    studentId: string;
    tutorId: string;
    paymentId: string;
    refundId?: string;
    amount: number;
    paymentStatus: 'Pending' | 'Completed' | 'Failed';
    sessionStatus: 'Scheduled' | 'Completed' | 'Cancelled';
    notes?: string;
}