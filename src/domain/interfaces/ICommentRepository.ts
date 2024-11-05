import { IComment } from "../entities/IComment";

export interface ICommentRepository {
    addComment(courseId: string, comment: IComment): Promise<IComment>;
    deleteComment(courseId: string, commentId: string): Promise<void>;
    // editComment(courseId: string, commentId: string, content: string): Promise<IComment>;
}