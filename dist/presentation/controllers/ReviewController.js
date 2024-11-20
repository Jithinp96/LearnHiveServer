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
exports.ReviewController = void 0;
const ReviewRepository_1 = require("../../infrastructure/repositories/ReviewRepository");
const ReviewUseCase_1 = require("../../application/useCases/ReviewUseCase");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const reviewRepository = new ReviewRepository_1.ReviewRepository();
const reviewUseCase = new ReviewUseCase_1.ReviewUseCase(reviewRepository);
class ReviewController {
    constructor() {
        this.addReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const { rating, comment } = req.body;
                const userId = req.userId;
                if (!userId) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
                    return;
                }
                const newReview = yield reviewUseCase.addReview(courseId, {
                    rating,
                    comment,
                    userId,
                    // helpful: 0,
                });
                res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json(newReview);
            }
            catch (error) {
                console.error('Error in addReview:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to add review' });
            }
        });
        // public updateReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        //     try {
        //         const { courseId, reviewId } = req.params;
        //         const { rating, comment } = req.body;
        //         const userId = req.userId;
        //         if (!userId) {
        //             res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
        //             return;
        //         }
        //         const updatedReview = await reviewUseCase.updateReview(courseId, reviewId, {
        //             rating,
        //             comment
        //         });
        //         res.status(HttpStatusEnum.OK).json(updatedReview);
        //     } catch (error) {
        //         console.error('Error in updateReview:', error);
        //         res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update review' });
        //     }
        // }
        this.deleteReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, reviewId } = req.params;
                const userId = req.userId;
                if (!userId) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
                    return;
                }
                yield reviewUseCase.deleteReview(courseId, reviewId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json({ message: 'Review deleted successfully' });
            }
            catch (error) {
                console.error('Error in deleteReview:', error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete review' });
            }
        });
    }
}
exports.ReviewController = ReviewController;
