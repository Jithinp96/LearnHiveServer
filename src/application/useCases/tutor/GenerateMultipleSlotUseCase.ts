import { ITutorSlot } from "../../../domain/entities/ITutorSlots";
import { IMultipleSlotSchedulerRepository } from "../../../domain/interfaces/IMultipleSlotSchedulerRepository";

export class GenerateMultipleSlotUseCase {
    private _multipleSlotSchedulerRepo: IMultipleSlotSchedulerRepository;

    constructor(multipleSlotScheduler: IMultipleSlotSchedulerRepository) {
        this._multipleSlotSchedulerRepo = multipleSlotScheduler;
    }

    async execute(tutorId: string, subject: string, level: string, date: string, startTime: string, endTime: string, price: number): Promise<ITutorSlot[]> {
        return await this._multipleSlotSchedulerRepo.generateDailySlots(tutorId, subject, level, date, startTime, endTime, price);
    }
}