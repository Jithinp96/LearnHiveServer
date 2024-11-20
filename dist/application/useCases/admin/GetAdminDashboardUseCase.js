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
exports.GetAdminDashboardStatsUseCase = void 0;
class GetAdminDashboardStatsUseCase {
    constructor(_adminDashboardRepository) {
        this._adminDashboardRepository = _adminDashboardRepository;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalStudents = yield this._adminDashboardRepository.countStudents();
            const totalTutors = yield this._adminDashboardRepository.countTutors();
            const totalCourseRevenue = yield this._adminDashboardRepository.calculateCourseRevenue();
            const totalSlotRevenue = yield this._adminDashboardRepository.calculateSlotRevenue();
            const topCourses = yield this._adminDashboardRepository.getTopCourses(5);
            const topCategories = yield this._adminDashboardRepository.getTopCategories(5);
            const topTutors = yield this._adminDashboardRepository.getTopTutors(3);
            return {
                totalStudents,
                totalTutors,
                totalCourseRevenue,
                totalSlotRevenue,
                topCourses,
                topCategories,
                topTutors,
            };
        });
    }
}
exports.GetAdminDashboardStatsUseCase = GetAdminDashboardStatsUseCase;
