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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const GenerateDailySlotUseCase_1 = require("../../application/useCases/tutor/GenerateDailySlotUseCase");
const SlotSchedulerRepository_1 = require("../repositories/SlotSchedulerRepository");
class CronScheduler {
    static initialize() {
        console.log("Inside Cron Scheduler");
        node_cron_1.default.schedule('0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
            console.log("Executing daily cron job for slot generation");
            try {
                const slotScheduler = new SlotSchedulerRepository_1.SlotSchedulerRepository();
                const generateDailySlotUseCase = new GenerateDailySlotUseCase_1.GenerateDailySlotUseCase(slotScheduler);
                const tutorsWithPreferences = yield slotScheduler.fetchTutorsForSlotCreation();
                for (const tutor of tutorsWithPreferences) {
                    const { tutorId, subject, level, startTime, endTime, price, endDate } = tutor;
                    yield generateDailySlotUseCase.execute(tutorId, subject, level, startTime, endTime, price, endDate);
                }
                console.log('Daily slots generated successfully for all tutors');
            }
            catch (error) {
                console.error('Error generating daily slots via cron:', error);
            }
        }));
    }
}
exports.CronScheduler = CronScheduler;
