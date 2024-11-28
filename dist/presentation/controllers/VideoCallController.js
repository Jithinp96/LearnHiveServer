"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallController = void 0;
const ValidateVideoCallAccessUseCase_1 = require("../../application/useCases/ValidateVideoCallAccessUseCase");
const TutorSlotRepository_1 = require("../../infrastructure/repositories/TutorSlotRepository");
const VCError_1 = require("../../domain/errors/VCError");
const tutorSlotRepository = new TutorSlotRepository_1.TutorSlotRepository();
const validateVideoCallAccessUseCase = new ValidateVideoCallAccessUseCase_1.ValidateVideoCallAccessUseCase(tutorSlotRepository);
class VideoCallController {
    constructor() {
        this.validateVideoCallAccess = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { roomId, userId, userType } = req.body;
            try {
                const result = yield validateVideoCallAccessUseCase.execute(roomId, userId, userType);
                return res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof VCError_1.InvalidMeetingRoomError) {
                    return res.status(403).json({ success: false, message: error.message });
                }
                else if (error instanceof VCError_1.UnauthorizedAccessError) {
                    return res.status(403).json({ success: false, message: error.message });
                }
                else if (error instanceof VCError_1.SlotNotBookedError) {
                    return res.status(403).json({ success: false, message: error.message });
                }
                else if (error instanceof VCError_1.MeetingNotActiveError) {
                    return res.status(403).json({ success: false, message: error.message });
                }
                console.error('Video call access validation error:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
}
exports.VideoCallController = VideoCallController;
;
