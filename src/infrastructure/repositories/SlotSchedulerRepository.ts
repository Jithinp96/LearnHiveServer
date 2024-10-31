import { ISlotSchedulerRepository } from '../../domain/interfaces/ISlotSchedulerRepository';
import { TutorSlotPreferenceModel } from '../database/models/TutorSlotPreferenceModel';
import { TutorSlotModel } from '../database/models/TutorStotModel';

export class SlotSchedulerRepository implements ISlotSchedulerRepository {
    
    async fetchTutorsForSlotCreation(): Promise<Array<{ tutorId: string, subject: string, level: string, startTime: string, endTime: string, price: number, endDate: Date}>> {
        const today = new Date();
        
        return await TutorSlotPreferenceModel.find({
            requiresDailySlotCreation: true,
            endDate: { $gte: today }
        }).select('tutorId subject level startTime endTime price endDate');
    }

    async generateDailySlots( tutorId: string, subject: string, level: string, startTime: string, endTime: string, price: number ): Promise<void> {
        const today = new Date();
        
        const newSlot = new TutorSlotModel({ tutorId, subject, level, date: today, startTime, endTime, price, isBooked: false, studentId: null, meetingId: null, meetingLink: null });

        await newSlot.save();
    }
}