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
exports.ValidateVideoCallAccessUseCase = void 0;
const VCError_1 = require("../../domain/errors/VCError");
class ValidateVideoCallAccessUseCase {
    constructor(tutorSlotRepository) {
        this.tutorSlotRepository = tutorSlotRepository;
    }
    execute(roomId, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const tutorSlot = yield this.tutorSlotRepository.findByMeetingId(roomId);
            if (!tutorSlot) {
                throw new VCError_1.InvalidMeetingRoomError();
            }
            const isValidAccess = userType === 'student'
                ? ((_a = tutorSlot.studentId) === null || _a === void 0 ? void 0 : _a.toString()) === userId
                : tutorSlot.tutorId.toString() === userId;
            if (!isValidAccess) {
                throw new VCError_1.UnauthorizedAccessError();
            }
            if (!tutorSlot.isBooked) {
                throw new VCError_1.SlotNotBookedError();
            }
            const currentTime = new Date();
            const slotStartTime = new Date(tutorSlot.date);
            const slotEndTime = new Date(tutorSlot.date);
            const [startHours, startMinutes] = tutorSlot.startTime.split(':').map(Number);
            const [endHours, endMinutes] = tutorSlot.endTime.split(':').map(Number);
            slotStartTime.setHours(startHours, startMinutes, 0, 0);
            slotEndTime.setHours(endHours, endMinutes, 0, 0);
            const bufferTime = 15 * 60 * 1000;
            if (currentTime < new Date(slotStartTime.getTime() - bufferTime) ||
                currentTime > new Date(slotEndTime.getTime() + bufferTime)) {
                throw new VCError_1.MeetingNotActiveError();
            }
            return { success: true, message: 'Access granted' };
        });
    }
}
exports.ValidateVideoCallAccessUseCase = ValidateVideoCallAccessUseCase;
