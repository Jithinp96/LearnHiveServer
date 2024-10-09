export interface IVideoUploadService {
    upload(fileBuffer: Buffer, filename: string): Promise<string>;
}