export interface Video {
    title: string;
    description: string;
    url: string;
}

export interface Review {
    rating: number;
    comment: string;
    userId: string;
}

export interface Comment {
    content: string;
    userId: string;
}
  
export interface Course {
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
    videos: Video[];
    reviews: Review[];
    comments: Comment[];
}