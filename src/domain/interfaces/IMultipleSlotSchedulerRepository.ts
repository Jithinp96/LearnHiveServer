import { ITutorSlot } from "../entities/ITutorSlots";

export interface IMultipleSlotSchedulerRepository {
    generateDailySlots(tutorId: string, subject: string, level: string, date: string, startTime: string, endTime: string, price: number): Promise<ITutorSlot[]>;
}