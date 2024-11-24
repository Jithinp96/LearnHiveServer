import { IProgressRepository } from "../../../domain/interfaces/IProgressRepository";
import { IOrderRepository } from "../../../domain/interfaces/IOrderRepository";
import { UpdateProgressDTO } from "../../dto/UpdateProgressDTO";
import { CourseProgressErrorEnum } from "../../../shared/enums/ErrorMessagesEnum";

export class UpdateCourseProgressUseCase {
    constructor(
        private _progressRepository: IProgressRepository,
        private _orderRepository: IOrderRepository
    ) {}

    async execute(dto: UpdateProgressDTO): Promise<void> {
        const { studentId, courseId, videoId } = dto;

        // Fetch the course progress for the given student and course
        const progress = await this._progressRepository.findByStudentAndCourse(studentId, courseId);
        if (!progress) {
            throw new Error(CourseProgressErrorEnum.PROGRESS_NOT_FOUND);
        }

        // If the video is not already marked as completed, update progress
        if (!progress.completedVideos.includes(videoId)) {
            progress.completedVideos.push(videoId);
            progress.progressPercentage = (progress.completedVideos.length / progress.totalVideos) * 100;

            // Update completion status if all videos are watched
            if (progress.completedVideos.length === progress.totalVideos) {
                progress.isCompleted = true;
                await this._orderRepository.updateCompletionStatus(studentId, courseId, "Completed");
            } else {
                await this._orderRepository.updateCompletionStatus(studentId, courseId, "In-Progress");
            }

            progress.lastWatchedVideo = videoId;
            progress.lastAccessedDate = new Date();

            // Save updated progress
            await this._progressRepository.update(progress);
        }
    }
}
