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
exports.FetchAssessmentResultByIdUseCase = void 0;
class FetchAssessmentResultByIdUseCase {
    constructor(_studentAssessmentRepo) {
        this._studentAssessmentRepo = _studentAssessmentRepo;
    }
    execute(assessmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Fetching assessment result for ID:", assessmentId); // Log assessmentId
                const assessmentResult = yield this._studentAssessmentRepo.getAssessmentResultById(assessmentId);
                if (!assessmentResult) {
                    console.error("Assessment result not found for ID:", assessmentId);
                    throw new Error("Assessment result not found");
                }
                return assessmentResult;
            }
            catch (error) {
                console.error("Error fetching assessment result by ID:", error);
                throw new Error("Failed to fetch assessment result details");
            }
        });
    }
}
exports.FetchAssessmentResultByIdUseCase = FetchAssessmentResultByIdUseCase;
