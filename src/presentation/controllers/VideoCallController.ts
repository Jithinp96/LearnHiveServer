import { Request, Response } from 'express';
import { ValidateVideoCallAccessUseCase } from '../../application/useCases/ValidateVideoCallAccessUseCase';
import { TutorSlotRepository } from '../../infrastructure/repositories/TutorSlotRepository';
import { InvalidMeetingRoomError, UnauthorizedAccessError, SlotNotBookedError, MeetingNotActiveError } from '../../domain/errors/VCError';

const tutorSlotRepository = new TutorSlotRepository();
const validateVideoCallAccessUseCase = new ValidateVideoCallAccessUseCase(tutorSlotRepository);

export class VideoCallController {
    constructor() {}

    public validateVideoCallAccess = async (req: Request, res: Response) => {
        const { roomId, userId, userType } = req.body;
    
        try {
            const result = await validateVideoCallAccessUseCase.execute(roomId, userId, userType);
            return res.status(200).json(result);
    
        } catch (error) {
            if (error instanceof InvalidMeetingRoomError) {
                return res.status(403).json({ success: false, message: error.message });
            } else if (error instanceof UnauthorizedAccessError) {
                return res.status(403).json({ success: false, message: error.message });
            } else if (error instanceof SlotNotBookedError) {
                return res.status(403).json({ success: false, message: error.message });
            } else if (error instanceof MeetingNotActiveError) {
                return res.status(403).json({ success: false, message: error.message });
            }
    
            console.error('Video call access validation error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
};
