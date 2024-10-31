import { TutorSlotModel } from '../database/models/TutorStotModel';
import { ITutorSlot } from '../../domain/entities/ITutorSlots';
import { ITutorSlotRepository } from '../../domain/interfaces/ITutorSlotRepository';

export class TutorSlotRepository implements ITutorSlotRepository {
    async create(slotData: ITutorSlot): Promise<ITutorSlot> {
        const newSlot = await TutorSlotModel.create(slotData);
        return newSlot.toObject();
    }

    async update(id: string, slotData: Partial<ITutorSlot>): Promise<ITutorSlot | null> {
        const updatedSlot = await TutorSlotModel.findByIdAndUpdate(id, slotData, { new: true });
        return updatedSlot ? updatedSlot.toObject() : null;
    }

    async findById(id: string): Promise<ITutorSlot | null> {
        const slot = await TutorSlotModel.findById(id);
        return slot ? slot.toObject() : null;
    }

    async findAll(tutorId: string): Promise<ITutorSlot[]> {
        const slots = await TutorSlotModel.find({ tutorId });
        return slots.map(slot => slot.toObject());
    }

    async updateSlotBooking( slotId: string, updateData: { isBooked: boolean; studentId: string; meetingId: string; meetingLink: string }): Promise<void> {
        await TutorSlotModel.findByIdAndUpdate( slotId, updateData, { new: true } );
      }
}