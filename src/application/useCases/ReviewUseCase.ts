import { IReviewRepository } from "../../domain/interfaces/IReviewRepository";
import { IReview } from "../../domain/entities/IReview";

export class ReviewUseCase {
    constructor(private _reviewRepository: IReviewRepository) {}

    async addReview(courseId: string, reviewData: Omit<IReview, '_id'>): Promise<IReview> {
        // Add any validation logic here
        return await this._reviewRepository.addReview(courseId, reviewData);
    }

    async deleteReview(courseId: string, reviewId: string): Promise<void> {
        return await this._reviewRepository.deleteReview(courseId, reviewId);
    }

    // async updateReview(courseId: string, reviewId: string, reviewData: Partial<IReview>): Promise<IReview> {
    //     // Add any validation logic here
    //     return await this._reviewRepository.updateReview(courseId, reviewId, reviewData);
    // }
}