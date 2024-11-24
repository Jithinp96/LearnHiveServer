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
exports.InitializeCourseProgressUseCase = void 0;
class InitializeCourseProgressUseCase {
    constructor(_progressRepository) {
        this._progressRepository = _progressRepository;
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { studentId, courseId, totalVideos } = dto;
            if (typeof totalVideos !== 'number' || totalVideos <= 0) {
                throw new Error("Total videos must be a positive number");
            }
            const progress = {
                studentId,
                courseId,
                completedVideos: [],
                totalVideos,
                progressPercentage: 0,
                isCompleted: false,
                lastWatchedVideo: null,
                lastAccessedDate: new Date(),
            };
            yield this._progressRepository.create(progress);
        });
    }
}
exports.InitializeCourseProgressUseCase = InitializeCourseProgressUseCase;
