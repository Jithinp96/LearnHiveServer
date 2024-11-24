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
exports.ProgressRepository = void 0;
const CourseProgressSchema_1 = require("../database/models/CourseProgressSchema");
class ProgressRepository {
    findByStudentAndCourse(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CourseProgressSchema_1.CourseProgress.findOne({ studentId, courseId });
        });
    }
    create(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProgress = new CourseProgressSchema_1.CourseProgress(progress);
            yield newProgress.save();
        });
    }
    update(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CourseProgressSchema_1.CourseProgress.findByIdAndUpdate(progress._id, progress, { new: true });
        });
    }
}
exports.ProgressRepository = ProgressRepository;
