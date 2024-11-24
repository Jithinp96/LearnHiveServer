export interface ICourseProgress {
    _id?: string
    studentId?: string;
    courseId?: string;
    completedVideos: string[];
    totalVideos: number;
    progressPercentage: number;
    isCompleted: boolean;
    lastWatchedVideo: string | null;
    lastAccessedDate: Date;
}