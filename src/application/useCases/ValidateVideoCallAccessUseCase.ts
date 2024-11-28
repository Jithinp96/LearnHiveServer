import { ITutorSlotRepository } from "../../domain/interfaces/ITutorSlotRepository";
import { InvalidMeetingRoomError, UnauthorizedAccessError, SlotNotBookedError, MeetingNotActiveError } from '../../domain/errors/VCError';

export class ValidateVideoCallAccessUseCase {
    private tutorSlotRepository: ITutorSlotRepository;

    constructor(tutorSlotRepository: ITutorSlotRepository) {
        this.tutorSlotRepository = tutorSlotRepository;
    }

    async execute(roomId: string, userId: string, userType: string) {
        const tutorSlot = await this.tutorSlotRepository.findByMeetingId(roomId);

        if (!tutorSlot) {
            throw new InvalidMeetingRoomError();
        }

        const isValidAccess = userType === 'student' 
            ? tutorSlot.studentId?.toString() === userId
            : tutorSlot.tutorId.toString() === userId;

        if (!isValidAccess) {
            throw new UnauthorizedAccessError();
        }

        if (!tutorSlot.isBooked) {
            throw new SlotNotBookedError();
        }

        const currentTime = new Date();
        const slotStartTime = new Date(tutorSlot.date);
        const slotEndTime = new Date(tutorSlot.date);

        const [startHours, startMinutes] = tutorSlot.startTime.split(':').map(Number);
        const [endHours, endMinutes] = tutorSlot.endTime.split(':').map(Number);
        
        slotStartTime.setHours(startHours, startMinutes, 0, 0);
        slotEndTime.setHours(endHours, endMinutes, 0, 0);

        const bufferTime = 15 * 60 * 1000;
        if (
            currentTime < new Date(slotStartTime.getTime() - bufferTime) || 
            currentTime > new Date(slotEndTime.getTime() + bufferTime)
        ) {
            throw new MeetingNotActiveError();
        }

        return { success: true, message: 'Access granted' };
    }
}