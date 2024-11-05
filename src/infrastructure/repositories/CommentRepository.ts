import { ObjectId } from "mongodb";

import { ICommentRepository } from "../../domain/interfaces/ICommentRepository";
import { IComment } from "../../domain/entities/IComment";
import { CourseModel } from "../database/models/CourseModel";
import { ICourse } from "../../domain/entities/ICourse";

export class CommentRepository implements ICommentRepository {
    async addComment(courseId: string, comment: IComment): Promise<IComment> {
        try {
            const course = await CourseModel.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }

            const newComment = { ...comment }

            course.comments.push(newComment);
            await course.save()
            return newComment
        } catch (error) {
            console.error('Error adding comment:', error);
            throw new Error('Failed to add comment');
        }
    }

    async deleteComment(courseId: string, commentId: string): Promise<void> {
        try {
            await CourseModel.findByIdAndUpdate(
                courseId,
                {$pull: { comments: { _id: commentId } } }
            )
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw new Error('Failed to delete comment');
        }
    }

    // async editComment(courseId: string, commentId: string, content: string): Promise<IComment> {
    //     const course = await CourseModel.findOneAndUpdate(
    //         { _id: courseId, 'comments._id': commentId },
    //         { $set: { 'comments.$.content': content } },
    //         { new: true }
    //     ).populate('comments.userId');

    //     if (!course) {
    //         throw new  Error('Course or Comment not found');
    //     }

    //     const updatedComment = course.comments.find(comment => comment._id.toString() === commentId);
    //     if (!updatedComment) {
    //         throw new Error('Comment not found');
    //     }
        
    //     return updatedComment;
    //   }

    // async updateComment(courseId: string, commentId: string, commentData: Partial<IComment>): Promise<IComment> {
    //     try {
    //         const course = await CourseModel.findById(courseId);
            
    //         if (!course) {
    //             throw new Error('Course not found');
    //         }

    //         const commentObjectId = new ObjectId(commentId);
    //         console.log("commentObjectId: ", commentObjectId);
            
    //         const commentIndex = course.comments.findIndex(
    //             (comment: Partial<IComment>) => (comment as any)._id.equals(commentObjectId)
    //         );
    //         // console.log("commentIndex: ", commentIndex);
    //         // console.log("course.comments[commentIndex]: ", course.comments[commentIndex]);

    //         if(commentIndex === -1) {
    //             throw new Error("Comment not found")
    //         }

    //         const updatedComment = {
    //             ...course.comments[commentIndex],
    //             ...commentData
    //         }
    //         // console.log("updatedComment: ", updatedComment);
            

    //         course.comments[commentIndex] = updatedComment;
    //         await course.save();

    //         return updatedComment
    //     } catch (error) {
    //         console.error('Error updating comment:', error);
    //         throw new Error('Failed to update comment');
    //     }
    // }
}