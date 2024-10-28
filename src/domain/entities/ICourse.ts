import { IComment } from "./IComment";
import { IReview } from "./IReview";
import { IVideo } from "./IVideo";

export interface ICourse {
    tutorId: string;
    title: string;
    description: string;
    shortDescription: string;
    tags: string[];
    category: string;
    price: number;
    offerPercentage?: number;
    purchaseCount: number;
    level: string;
    duration: number;
    thumbnail: string;
    isBlocked: boolean;
    isApproved: boolean;
    isListed: boolean;
    videos: IVideo[];
    reviews: IReview[];
    comments: IComment[];
}