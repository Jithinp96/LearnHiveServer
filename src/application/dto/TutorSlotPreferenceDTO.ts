export interface TutorSlotPreferenceDTO {
    tutorId: string;
    subject: string;
    level: string;
    endDate: Date;
    startTime: string;
    endTime: string;
    price: number;
    requiresDailySlotCreation?: boolean;
}