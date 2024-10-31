import { ISlotSchedulerRepository } from "../../../domain/interfaces/ISlotSchedulerRepository";

export class GenerateDailySlotUseCase {
    private _slotSchedulerRepo: ISlotSchedulerRepository;

    constructor(slotScheduler: ISlotSchedulerRepository) {
        this._slotSchedulerRepo = slotScheduler;
    }

    async execute( tutorId: string, subject: string, level: string, startTime: string, endTime: string, price: number, endDate: Date): Promise<void> {
        console.log("Inside GenerateDailySlotUseCase");

        const today = new Date();
        if (today > endDate) {
            console.log(`Slot creation ended for tutor ${tutorId} as endDate has passed.`);
            return;
        }

        await this._slotSchedulerRepo.generateDailySlots(tutorId, subject, level, startTime, endTime, price);
    }
}