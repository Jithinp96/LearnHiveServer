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
exports.CommentController = void 0;
const CommentUseCase_1 = require("../../application/useCases/CommentUseCase");
const CommentRepository_1 = require("../../infrastructure/repositories/CommentRepository");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const ErrorMessagesEnum_1 = require("../../shared/enums/ErrorMessagesEnum");
const commentRepository = new CommentRepository_1.CommentRepository;
const commentUseCase = new CommentUseCase_1.CommentUseCase(commentRepository);
class CommentController {
    constructor() {
        this.addComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const { content } = req.body;
                const userId = req.userId;
                if (!userId) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
                    return;
                }
                const newComment = yield commentUseCase.addComment(courseId, { content, userId });
                res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json(newComment);
            }
            catch (error) {
                console.error('Error in addComment:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to add comment' });
            }
        });
        this.deleteComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, commentId } = req.params;
                const userId = req.userId;
                if (!userId) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
                    return;
                }
                yield commentUseCase.deleteComment(courseId, commentId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ message: 'Comment deleted successfully' });
            }
            catch (error) {
                console.error('Error in deleteReview:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete review' });
            }
        });
        this.editComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentId = req.userId;
            const { courseId, commentId } = req.params;
            const { content } = req.body;
            if (!studentId) {
                return res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({
                    success: false,
                    message: ErrorMessagesEnum_1.AuthErrorEnum.INVALID_ID
                });
            }
            try {
                const updatedComment = yield commentUseCase.editComment(courseId, commentId, { content });
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(updatedComment);
            }
            catch (error) {
                console.error('Error in updateComment:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update comment' });
            }
        });
        // public updateComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        //     console.log("Reached update comment controller");
        //     try {
        //         const { courseId, commentId } = req.params;
        //         const { content } = req.body;
        //         const userId = req.userId;
        //         console.log("courseId: ", courseId);
        //         console.log("commentId: ", commentId);
        //         console.log("content: ", content);
        //         console.log("userId: ", userId);
        //         if (!userId) {
        //             res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
        //             return;
        //         }
        //         const updatedComment = await commentUseCase.updateComment(courseId, commentId, { content });
        //         res.status(HttpStatusEnum.OK).json(updatedComment);
        //     } catch (error) {
        //         console.error('Error in updateComment:', error);
        //         res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update comment' });
        //     }
        // }
    }
}
exports.CommentController = CommentController;
