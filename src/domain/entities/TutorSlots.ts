export interface TutorSlot {
    tutorId: string;
    subject: string;
    level: string;
    date: Date;
    startTime: string;
    endTime: string;
    price: number;
    isBooked: boolean;
    studentId?: string;
}