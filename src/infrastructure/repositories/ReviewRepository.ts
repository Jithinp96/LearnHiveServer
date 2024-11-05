import { IReviewRepository } from "../../domain/interfaces/IReviewRepository";
import { IReview } from "../../domain/entities/IReview";
import { CourseModel } from "../database/models/CourseModel";


export class ReviewRepository implements IReviewRepository {
    async addReview(courseId: string, review: IReview): Promise<IReview> {
        try {
            const course = await CourseModel.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }

            const newReview = {
                ...review,
            };

            course.reviews.push(newReview);
            await course.save();

            return newReview;
        } catch (error) {
            console.error('Error adding review:', error);
            throw new Error('Failed to add review');
        }
    }

    async deleteReview(courseId: string, reviewId: string): Promise<void> {
        try {
            await CourseModel.findByIdAndUpdate(
                courseId, 
                { $pull: { reviews: { _id: reviewId } } }
            );
        } catch (error) {
            console.error('Error deleting review:', error);
            throw new Error('Failed to delete review');
        }
    }

    // async updateReview(courseId: string, reviewId: string, reviewData: Partial<IReview>): Promise<IReview> {
    //     try {
    //         const course = await CourseModel.findById(courseId);
    //         if (!course) {
    //             throw new Error('Course not found');
    //         }

    //         const reviewIndex = course.reviews.findIndex(
    //             review => review._id.toString() === reviewId
    //         );

    //         if (reviewIndex === -1) {
    //             throw new Error('Review not found');
    //         }

    //         // Merge existing review with new data
    //         const updatedReview = {
    //             ...course.reviews[reviewIndex],
    //             ...reviewData
    //         };

    //         course.reviews[reviewIndex] = updatedReview;
    //         await course.save();

    //         return updatedReview;
    //     } catch (error) {
    //         console.error('Error updating review:', error);
    //         throw new Error('Failed to update review');
    //     }
    // }
}