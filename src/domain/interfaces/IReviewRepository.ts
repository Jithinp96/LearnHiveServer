import { IReview } from "../entities/IReview";

export interface IReviewRepository {
    addReview(courseId: string, review: IReview): Promise<IReview>;
    deleteReview(courseId: string, reviewId: string): Promise<void>;
    // updateReview(courseId: string, reviewId: string, reviewData: Partial<IReview>): Promise<IReview>;
}