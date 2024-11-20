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
const uuid_1 = require("uuid");
const TutorStotModel_1 = require("../../../infrastructure/database/models/TutorStotModel");
function confirmSlotBookingUseCase(slotId, studentId, paymentDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const slot = yield TutorStotModel_1.TutorSlotModel.findById(slotId);
        if (!slot || slot.isBooked)
            throw new Error("Slot not available");
        const roomId = (0, uuid_1.v4)();
        slot.isBooked = true;
        slot.studentId = studentId;
        slot.meetingId = roomId;
        slot.meetingLink = `https://your-platform.com/room/${roomId}`;
        yield slot.save();
        return slot;
    });
}
