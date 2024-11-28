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
exports.TutorSlotRepository = void 0;
const TutorStotModel_1 = require("../database/models/TutorStotModel");
class TutorSlotRepository {
    create(slotData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newSlot = yield TutorStotModel_1.TutorSlotModel.create(slotData);
            return newSlot.toObject();
        });
    }
    update(id, slotData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedSlot = yield TutorStotModel_1.TutorSlotModel.findByIdAndUpdate(id, slotData, { new: true });
            return updatedSlot ? updatedSlot.toObject() : null;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const slot = yield TutorStotModel_1.TutorSlotModel.findById(id);
            return slot ? slot.toObject() : null;
        });
    }
    findAll(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slots = yield TutorStotModel_1.TutorSlotModel.find({ tutorId });
            return slots.map(slot => slot.toObject());
        });
    }
    updateSlotBooking(slotId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TutorStotModel_1.TutorSlotModel.findByIdAndUpdate(slotId, updateData, { new: true });
        });
    }
    findByMeetingId(meetingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slot = yield TutorStotModel_1.TutorSlotModel.findOne({ meetingId }).exec();
            return slot ? new TutorStotModel_1.TutorSlotModel(slot) : null;
        });
    }
}
exports.TutorSlotRepository = TutorSlotRepository;
