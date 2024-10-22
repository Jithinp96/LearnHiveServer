import { TutorSlot } from "../entities/TutorSlots";

export interface ITutorSlotRepository{
    create(slotData: TutorSlot): Promise<TutorSlot>;
    update(id: string, slotData: Partial<TutorSlot>): Promise<TutorSlot | null>;
    findById(id: string): Promise<TutorSlot | null>;
    findAll(tutorId: string): Promise<TutorSlot[]>;
}