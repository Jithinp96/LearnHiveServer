"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3VideoUploadService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
});
class S3VideoUploadService {
    constructor() {
        this._s3 = new aws_sdk_1.default.S3({
            region: process.env.S3_BUCKET_REGION || 'us-east-1',
        });
    }
    upload(file, filename) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const data = yield this._s3.upload(params).promise();
                return data.Location;
            }
            catch (error) {
                console.error('Error uploading video:', error);
                throw new Error(`Failed to upload video: ${error}`);
            }
        });
    }
}
exports.S3VideoUploadService = S3VideoUploadService;
