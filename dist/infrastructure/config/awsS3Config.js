"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const awsAccessKey = process.env.S3_ACCESS_KEY;
const secretKey = process.env.S3_SECRET_KEY;
const bucketRegion = process.env.S3_BUCKET_REGION;
if (!awsAccessKey || !secretKey || !bucketRegion) {
    throw new Error('AWS credentials and bucket information must be provided in the environment variables');
}
exports.s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: secretKey,
    },
    region: bucketRegion
});
