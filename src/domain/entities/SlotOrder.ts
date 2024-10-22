export interface SlotOrder {
    _id: string;
    studentId: string;
    tutorId: string;
    paymentId: string;
    amount: number;
    paymentStatus: 'pending' | 'completed' | 'failed';
    sessionStatus: 'scheduled' | 'completed' | 'cancelled';
    meetingLink?: string;
    notes?: string;
}