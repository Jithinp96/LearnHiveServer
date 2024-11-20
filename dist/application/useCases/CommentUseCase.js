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
exports.CommentUseCase = void 0;
const mongodb_1 = require("mongodb");
const CourseModel_1 = require("../../infrastructure/database/models/CourseModel");
class CommentUseCase {
    constructor(_commentRepo) {
        this._commentRepo = _commentRepo;
    }
    addComment(courseId, commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._commentRepo.addComment(courseId, commentData);
        });
    }
    deleteComment(courseId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._commentRepo.deleteComment(courseId, commentId);
        });
    }
    editComment(courseId, commentId, commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield CourseModel_1.CourseModel.findById(courseId);
                if (!course) {
                    throw new Error('Course not found');
                }
                const commentObjectId = new mongodb_1.ObjectId(commentId);
                console.log("commentObjectId: ", commentObjectId);
                const commentIndex = course.comments.findIndex((comment) => comment._id.equals(commentObjectId));
                // console.log("commentIndex: ", commentIndex);
                // console.log("course.comments[commentIndex]: ", course.comments[commentIndex]);
                if (commentIndex === -1) {
                    throw new Error("Comment not found");
                }
                const updatedComment = Object.assign(Object.assign({}, course.comments[commentIndex]), commentData);
                course.comments[commentIndex] = updatedComment;
                // return await this._commentRepo.editComment(courseId, updatedComment)
            }
            catch (error) {
            }
        });
    }
}
exports.CommentUseCase = CommentUseCase;
