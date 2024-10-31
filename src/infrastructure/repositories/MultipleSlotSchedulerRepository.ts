import { ITutorSlot } from "../../domain/entities/ITutorSlots";
import { IMultipleSlotSchedulerRepository } from "../../domain/interfaces/IMultipleSlotSchedulerRepository";
import { TutorSlotModel } from "../database/models/TutorStotModel";

export class MultipleSlotSchedulerRepository implements IMultipleSlotSchedulerRepository {
    public async generateDailySlots(tutorId: string, subject: string, level: string, date: string, startTime: string, endTime: string, price: number): Promise<ITutorSlot[]> {
        const today = new Date();
        const endDate = new Date(date)
        console.log("endDate: ", endDate);
        
        const differenceInTime = endDate.getTime() - today.getTime();
        const numberOfDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        const createdSlots: ITutorSlot[] = [];

        for (let i = 1; i <= numberOfDays; i++) {
            const slotDate = new Date(today);
            slotDate.setDate(today.getDate() + i);

            const slotData: ITutorSlot = {
                tutorId,
                subject,
                level,
                date: slotDate,
                startTime,
                endTime,
                price,
                isBooked: false,
            };

            const existingSlot = await TutorSlotModel.findOne({
                tutorId,
                date: slotDate,
                startTime,
                endTime
            });

            if (!existingSlot) {
                // await TutorSlotModel.create(slotData);
                const newSlot = await TutorSlotModel.create(slotData);
                createdSlots.push(newSlot);
            }
        }
        return createdSlots;
    }
}