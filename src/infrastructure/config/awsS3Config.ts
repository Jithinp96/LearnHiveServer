import { S3Client } from '@aws-sdk/client-s3'; 
import dotenv from "dotenv";

dotenv.config();

const awsAccessKey = process.env.S3_ACCESS_KEY;
const secretKey = process.env.S3_SECRET_KEY;
const bucketRegion = process.env.S3_BUCKET_REGION;


if (!awsAccessKey || !secretKey || !bucketRegion ) {
    throw new Error('AWS credentials and bucket information must be provided in the environment variables');
}
export const s3= new S3Client({
    credentials:{
        accessKeyId: awsAccessKey,
        secretAccessKey:secretKey,
    },
    region:bucketRegion
})