import { TutorSlotModel } from '../database/models/TutorStotModel';
import { TutorSlot } from '../../domain/entities/TutorSlots';
import { ITutorSlotRepository } from '../../domain/interfaces/ITutorSlotRepository';

export class TutorSlotRepository implements ITutorSlotRepository {
    async create(slotData: TutorSlot): Promise<TutorSlot> {
        const newSlot = await TutorSlotModel.create(slotData);
        return newSlot.toObject();
    }

    async update(id: string, slotData: Partial<TutorSlot>): Promise<TutorSlot | null> {
        const updatedSlot = await TutorSlotModel.findByIdAndUpdate(id, slotData, { new: true });
        return updatedSlot ? updatedSlot.toObject() : null;
    }

    async findById(id: string): Promise<TutorSlot | null> {
        const slot = await TutorSlotModel.findById(id);
        return slot ? slot.toObject() : null;
    }

    async findAll(tutorId: string): Promise<TutorSlot[]> {
        const slots = await TutorSlotModel.find({ tutorId });
        return slots.map(slot => slot.toObject());
    }
}