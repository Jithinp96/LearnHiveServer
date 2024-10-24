import { Course, Video } from '../../domain/entities/Course';
import { ICourseRepository } from '../../domain/interfaces/ICourseRepository';
import { IVideoUploadService } from '../../domain/interfaces/IVideoUpload';

export class CourseUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _videoUploadService: IVideoUploadService
    ) {}

    async addCourse(course: Course): Promise<Course> {
        return await this._courseRepository.addCourse(course);
    }

    async uploadVideo(videoData: { title: string, description: string, file: Express.Multer.File }): Promise<Video> {
        const { title, description, file } = videoData;

        const fileName = `${Date.now()}-${title}`;
        const fileUrl = await this._videoUploadService.upload(file.buffer, fileName);

        const video: Video = {
            title,
            description,
            url: fileUrl
        };

        return video;
    }

    async fetchAllCourse(): Promise<Course[]> {
        try {
            return this._courseRepository.findAllCourse();
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw new Error('Failed to fetch courses');
        }
    }

    async fetchCourseDetails( courseId: string ): Promise<Course | null> {
        try {
            return this._courseRepository.findCourseById(courseId);
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw new Error('Failed to fetch course details');
        }
    }
}