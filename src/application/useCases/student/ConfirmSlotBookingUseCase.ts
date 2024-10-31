import { v4 as uuidv4 } from 'uuid';
import { TutorSlotModel } from '../../../infrastructure/database/models/TutorStotModel';

async function confirmSlotBookingUseCase(slotId: string, studentId: string, paymentDetails: any) {
    const slot = await TutorSlotModel.findById(slotId);
    if (!slot || slot.isBooked) throw new Error("Slot not available");

    const roomId = uuidv4();

    slot.isBooked = true;
    slot.studentId = studentId;
    slot.meetingId = roomId;
    slot.meetingLink = `https://your-platform.com/room/${roomId}`;
    await slot.save();

    return slot;
}
