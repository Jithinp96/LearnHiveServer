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
exports.CommentRepository = void 0;
const CourseModel_1 = require("../database/models/CourseModel");
class CommentRepository {
    addComment(courseId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield CourseModel_1.CourseModel.findById(courseId);
                if (!course) {
                    throw new Error('Course not found');
                }
                const newComment = Object.assign({}, comment);
                course.comments.push(newComment);
                yield course.save();
                return newComment;
            }
            catch (error) {
                console.error('Error adding comment:', error);
                throw new Error('Failed to add comment');
            }
        });
    }
    deleteComment(courseId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield CourseModel_1.CourseModel.findByIdAndUpdate(courseId, { $pull: { comments: { _id: commentId } } });
            }
            catch (error) {
                console.error('Error deleting comment:', error);
                throw new Error('Failed to delete comment');
            }
        });
    }
}
exports.CommentRepository = CommentRepository;
