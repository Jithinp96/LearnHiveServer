import { Request, Response } from 'express';
import { ReviewRepository } from '../../infrastructure/repositories/ReviewRepository';
import { ReviewUseCase } from '../../application/useCases/ReviewUseCase';
import { HttpStatusEnum } from '../../shared/enums/HttpStatusEnum';

const reviewRepository = new ReviewRepository();
const reviewUseCase = new ReviewUseCase(reviewRepository);

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export class ReviewController {
    public addReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { courseId } = req.params;
            const { rating, comment } = req.body;
            const userId = req.userId;

            if (!userId) {
                res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }

            const newReview = await reviewUseCase.addReview(courseId, {
                rating,
                comment,
                userId,
                // helpful: 0,
            });

            res.status(HttpStatusEnum.CREATED).json(newReview);
        } catch (error) {
            console.error('Error in addReview:', error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to add review' });
        }
    }

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

    public deleteReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { courseId, reviewId } = req.params;
            const userId = req.userId

            if (!userId) {
                res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }

            await reviewUseCase.deleteReview(courseId, reviewId);

            res.status(HttpStatusEnum.OK).json({ message: 'Review deleted successfully' });
        } catch (error) {
            console.error('Error in deleteReview:', error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete review' });
        }
    }
}