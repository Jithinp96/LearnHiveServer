import { ITutorSlot } from "../entities/ITutorSlots";

export interface ITutorSlotRepository{
    create(slotData: ITutorSlot): Promise<ITutorSlot>;
    update(id: string, slotData: Partial<ITutorSlot>): Promise<ITutorSlot | null>;
    updateSlotBooking(slotId: string, updateData: { isBooked: boolean; studentId: string }): Promise<void>;
    findById(id: string): Promise<ITutorSlot | null>;
    findAll(tutorId: string): Promise<ITutorSlot[]>;
}