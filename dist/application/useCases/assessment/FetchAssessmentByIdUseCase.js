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
exports.FetchAssessmentByIdUseCase = void 0;
class FetchAssessmentByIdUseCase {
    constructor(_assessmentRepo) {
        this._assessmentRepo = _assessmentRepo;
    }
    execute(assessmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const assessment = yield this._assessmentRepo.getAssessmentById(assessmentId);
                if (!assessment) {
                    throw new Error("Assessment not found");
                }
                return assessment;
            }
            catch (error) {
                console.error("Error fetching assessment by ID:", error);
                throw new Error("Failed to fetch assessment details");
            }
        });
    }
}
exports.FetchAssessmentByIdUseCase = FetchAssessmentByIdUseCase;
