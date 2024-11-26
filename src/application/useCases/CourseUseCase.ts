import { ICourse } from '../../domain/entities/ICourse';
import { IVideo } from '../../domain/entities/IVideo';
import { ICourseRepository } from '../../domain/interfaces/ICourseRepository';
import { IVideoUploadService } from '../../domain/interfaces/IVideoUpload';

export class CourseUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _videoUploadService: IVideoUploadService
    ) {}

    async addCourse(course: ICourse): Promise<ICourse> {
        return await this._courseRepository.addCourse(course);
    }

    async uploadVideo(videoData: { title: string, description: string, file: Express.Multer.File }): Promise<IVideo> {
        const { title, description, file } = videoData;

        const fileName = `${Date.now()}-${title}`;
        const fileUrl = await this._videoUploadService.upload(file.buffer, fileName);

        const video: IVideo = {
            title,
            description,
            url: fileUrl
        };

        return video;
    }

    async fetchAllCourse(filters: any): Promise<ICourse[]> {
        try {
            return this._courseRepository.findAllCourse(filters);
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw new Error('Failed to fetch courses');
        }
    }

    async fetchAllCourseForAdmin(): Promise<ICourse[]> {
        try {
            return this._courseRepository.findAllCourseForAdmin();
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw new Error('Failed to fetch courses');
        }
    }

    async fetchCourseDetails( courseId: string ): Promise<ICourse | null> {
        try {
            return this._courseRepository.findCourseById(courseId);
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw new Error('Failed to fetch course details');
        }
    }

    async fetchCourseViewer(courseId: string, studentId: string): Promise<ICourse | null> {
        try {
            return this._courseRepository.findCourseById(courseId, studentId);
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw new Error('Failed to fetch course details');
        }
    }

    async fetchStudentCourseProgress(studentId: string): Promise<void> {
        try {
            return this._courseRepository.findStudentCourseProgress(studentId)
        } catch (error) {
            throw new Error("Unable to fetch student course progress.");
        }
    }

    async approveCourse(courseId: string): Promise<void> {
        const course = await this._courseRepository.findCourseById(courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        await this._courseRepository.approveCourse(courseId);
    }

    async toggleCourseStatus(courseId: string, status: boolean): Promise<void> {
        const course = await this._courseRepository.findCourseById(courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        await this._courseRepository.toggleBlockStatus(courseId, !status);
    }
}