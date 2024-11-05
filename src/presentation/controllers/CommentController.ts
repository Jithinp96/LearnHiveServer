import { Request, Response } from 'express';
import { CommentUseCase } from "../../application/useCases/CommentUseCase";
import { CommentRepository } from "../../infrastructure/repositories/CommentRepository";
import { HttpStatusEnum } from "../../shared/enums/HttpStatusEnum";
import { AuthErrorEnum } from '../../shared/enums/ErrorMessagesEnum';

const commentRepository = new CommentRepository;
const commentUseCase = new CommentUseCase(commentRepository)

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export class CommentController {
    public addComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { courseId } = req.params;
            const { content } = req.body;
            const userId = req.userId;

            if (!userId) {
                res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }

            const newComment = await commentUseCase.addComment(courseId, { content, userId } )
            res.status(HttpStatusEnum.CREATED).json(newComment);

        } catch (error) {
            console.error('Error in addComment:', error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to add comment' });
        }
    }

    public deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { courseId, commentId } = req.params;
            const userId = req.userId;

            if (!userId) {
                res.status(HttpStatusEnum.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }

            await commentUseCase.deleteComment(courseId ,commentId);

            res.status(HttpStatusEnum.OK).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Error in deleteReview:', error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete review' });
        }
    }

    public editComment = async (req: AuthenticatedRequest, res: Response) => {
        const studentId = req.userId;
        const { courseId, commentId } = req.params;
        const { content } = req.body;

        if (!studentId) {
            return res.status(HttpStatusEnum.UNAUTHORIZED).json({
                success: false,
                message: AuthErrorEnum.INVALID_ID
            });
        }

        try {
            const updatedComment = await commentUseCase.editComment(courseId, commentId, { content });
            res.status(HttpStatusEnum.OK).json(updatedComment);
        } catch (error) {
            console.error('Error in updateComment:', error);
            res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update comment' });
        }
    }

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