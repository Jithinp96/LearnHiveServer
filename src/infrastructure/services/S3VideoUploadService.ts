import { PutObjectCommand } from "@aws-sdk/client-s3";
import { IVideoUploadService } from "../../domain/interfaces/IVideoUpload";
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
})

export class S3VideoUploadService implements IVideoUploadService {
    private _s3: AWS.S3;

    constructor() {
        this._s3 = new AWS.S3({
            region: process.env.S3_BUCKET_REGION || 'us-east-1',
        });
    }

    async upload(file: Buffer, filename: string): Promise<string> {
        const bucketName = process.env.S3_BUCKET_NAME;
        
        if (!bucketName) {
            throw new Error('AWS_BUCKET_NAME is not defined in the environment variables');
        }
        const params = {
            Bucket: bucketName,
            Key: filename,
            Body: file.buffer,
            ContentType: 'video/mp4',
            ACL: 'public-read',
        };
        try {
            
            const data = await this._s3.upload(params).promise();
            return data.Location;
        } catch (error) {
            console.error('Error uploading video:', error);
            throw new Error(`Failed to upload video: ${error}`);
        }
    }
}