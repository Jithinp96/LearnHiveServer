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
exports.GenerateDailySlotUseCase = void 0;
class GenerateDailySlotUseCase {
    constructor(slotScheduler) {
        this._slotSchedulerRepo = slotScheduler;
    }
    execute(tutorId, subject, level, startTime, endTime, price, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Inside GenerateDailySlotUseCase");
            const today = new Date();
            if (today > endDate) {
                console.log(`Slot creation ended for tutor ${tutorId} as endDate has passed.`);
                return;
            }
            yield this._slotSchedulerRepo.generateDailySlots(tutorId, subject, level, startTime, endTime, price);
        });
    }
}
exports.GenerateDailySlotUseCase = GenerateDailySlotUseCase;
