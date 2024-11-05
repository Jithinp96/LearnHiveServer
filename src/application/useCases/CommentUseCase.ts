import { ObjectId } from "mongodb";

import { IComment } from "../../domain/entities/IComment";
import { ICommentRepository } from "../../domain/interfaces/ICommentRepository";
import { CourseModel } from "../../infrastructure/database/models/CourseModel";

export class CommentUseCase {
    constructor(private _commentRepo: ICommentRepository) {}

    async addComment(courseId: string, commentData: IComment): Promise<IComment> {
        return await this._commentRepo.addComment(courseId, commentData);
    }

    async deleteComment(courseId: string, commentId: string): Promise<void> {
        return await this._commentRepo.deleteComment(courseId, commentId);
    }

    async editComment(courseId: string, commentId: string, commentData: Partial<IComment>) {
        try {
            const course = await CourseModel.findById(courseId);
            
            if (!course) {
                throw new Error('Course not found');
            }

            const commentObjectId = new ObjectId(commentId);
            console.log("commentObjectId: ", commentObjectId);
            
            const commentIndex = course.comments.findIndex(
                (comment: Partial<IComment>) => (comment as any)._id.equals(commentObjectId)
            );
            // console.log("commentIndex: ", commentIndex);
            // console.log("course.comments[commentIndex]: ", course.comments[commentIndex]);

            if(commentIndex === -1) {
                throw new Error("Comment not found")
            }

            const updatedComment = {
                ...course.comments[commentIndex],
                ...commentData
            }
            course.comments[commentIndex] = updatedComment;

            // return await this._commentRepo.editComment(courseId, updatedComment)
        } catch (error) {
            
        }

    }

    // async updateComment(courseId: string, commentId: string, commentData: Partial<IComment>): Promise<IComment> {
    //     console.log("Inside update comment usecase");
    //     return await this._commentRepo.updateComment(courseId, commentId, commentData)
    // }
}