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
exports.StudentDashboardUseCase = void 0;
class StudentDashboardUseCase {
    constructor(_courseRepo, _orderRepo) {
        this._courseRepo = _courseRepo;
        this._orderRepo = _orderRepo;
    }
    execute(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newCourses, topRatedCourses, suggestedCourses, topPurchasedCourses] = yield Promise.all([
                this._courseRepo.getNewCourses(4),
                this._courseRepo.getTopRatedCourses(4),
                this._courseRepo.getSuggestedCourses(studentId, 4),
                this._orderRepo.getTopPurchasedCourses(4)
            ]);
            return {
                newCourses,
                topRatedCourses,
                suggestedCourses,
                topPurchasedCourses
            };
        });
    }
}
exports.StudentDashboardUseCase = StudentDashboardUseCase;
