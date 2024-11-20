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
exports.SlotSchedulerRepository = void 0;
const TutorSlotPreferenceModel_1 = require("../database/models/TutorSlotPreferenceModel");
const TutorStotModel_1 = require("../database/models/TutorStotModel");
class SlotSchedulerRepository {
    fetchTutorsForSlotCreation() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            return yield TutorSlotPreferenceModel_1.TutorSlotPreferenceModel.find({
                requiresDailySlotCreation: true,
                endDate: { $gte: today }
            }).select('tutorId subject level startTime endTime price endDate');
        });
    }
    generateDailySlots(tutorId, subject, level, startTime, endTime, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const newSlot = new TutorStotModel_1.TutorSlotModel({ tutorId, subject, level, date: today, startTime, endTime, price, isBooked: false, studentId: null, meetingId: null, meetingLink: null });
            yield newSlot.save();
        });
    }
}
exports.SlotSchedulerRepository = SlotSchedulerRepository;
