import { ICourseProgress } from "../../../domain/entities/ICourseProgress";
import { IProgressRepository } from "../../../domain/interfaces/IProgressRepository";
import { InitializeProgressDTO } from "../../dto/InitializeProgressDTO";

export class InitializeCourseProgressUseCase {
  constructor(private _progressRepository: IProgressRepository) {}

  async execute(dto: InitializeProgressDTO): Promise<void> {
    const { studentId, courseId, totalVideos } = dto;

    if (typeof totalVideos !== 'number' || totalVideos <= 0) {
      throw new Error("Total videos must be a positive number");
    }

    const progress: ICourseProgress = {
      studentId,
      courseId,
      completedVideos: [],
      totalVideos,
      progressPercentage: 0,
      isCompleted: false,
      lastWatchedVideo: null,
      lastAccessedDate: new Date(),
    };

    await this._progressRepository.create(progress);
  }
}