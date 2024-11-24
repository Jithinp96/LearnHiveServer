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
exports.UpdateCourseProgressUseCase = void 0;
const ErrorMessagesEnum_1 = require("../../../shared/enums/ErrorMessagesEnum");
class UpdateCourseProgressUseCase {
    constructor(_progressRepository, _orderRepository) {
        this._progressRepository = _progressRepository;
        this._orderRepository = _orderRepository;
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { studentId, courseId, videoId } = dto;
            const progress = yield this._progressRepository.findByStudentAndCourse(studentId, courseId);
            if (!progress) {
                throw new Error(ErrorMessagesEnum_1.CourseProgressErrorEnum.PROGRESS_NOT_FOUND);
            }
            if (!progress.completedVideos.includes(videoId)) {
                progress.completedVideos.push(videoId);
                progress.progressPercentage = (progress.completedVideos.length / progress.totalVideos) * 100;
                if (progress.completedVideos.length === progress.totalVideos) {
                    progress.isCompleted = true;
                    yield this._orderRepository.updateCompletionStatus(studentId, courseId, "Completed");
                }
                else {
                    yield this._orderRepository.updateCompletionStatus(studentId, courseId, "In-Progress");
                }
                progress.lastWatchedVideo = videoId;
                progress.lastAccessedDate = new Date();
                yield this._progressRepository.update(progress);
            }
        });
    }
}
exports.UpdateCourseProgressUseCase = UpdateCourseProgressUseCase;
