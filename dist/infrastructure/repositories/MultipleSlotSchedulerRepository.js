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
exports.MultipleSlotSchedulerRepository = void 0;
const TutorStotModel_1 = require("../database/models/TutorStotModel");
class MultipleSlotSchedulerRepository {
    generateDailySlots(tutorId, subject, level, date, startTime, endTime, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const endDate = new Date(date);
            console.log("endDate: ", endDate);
            const differenceInTime = endDate.getTime() - today.getTime();
            const numberOfDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
            const createdSlots = [];
            for (let i = 1; i <= numberOfDays; i++) {
                const slotDate = new Date(today);
                slotDate.setDate(today.getDate() + i);
                const slotData = {
                    tutorId,
                    subject,
                    level,
                    date: slotDate,
                    startTime,
                    endTime,
                    price,
                    isBooked: false,
                };
                const existingSlot = yield TutorStotModel_1.TutorSlotModel.findOne({
                    tutorId,
                    date: slotDate,
                    startTime,
                    endTime
                });
                if (!existingSlot) {
                    // await TutorSlotModel.create(slotData);
                    const newSlot = yield TutorStotModel_1.TutorSlotModel.create(slotData);
                    createdSlots.push(newSlot);
                }
            }
            return createdSlots;
        });
    }
}
exports.MultipleSlotSchedulerRepository = MultipleSlotSchedulerRepository;
