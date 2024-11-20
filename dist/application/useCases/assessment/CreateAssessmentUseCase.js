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
exports.CreateAssessmentUseCase = void 0;
class CreateAssessmentUseCase {
    constructor(_assessmentRepo) {
        this._assessmentRepo = _assessmentRepo;
    }
    execute(assessmentData, tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Reached create Assessment service");
            const assessment = Object.assign(Object.assign({}, assessmentData), { tutorId });
            return yield this._assessmentRepo.createAssessment(assessment);
        });
    }
}
exports.CreateAssessmentUseCase = CreateAssessmentUseCase;
