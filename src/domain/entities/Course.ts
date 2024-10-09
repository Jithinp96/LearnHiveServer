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
    createdAt: Date;
}
  
export interface Course {
    tutorId: string;
    title: string;
    description: string;
    tags: string[];
    category: string;
    price: number;
    offerPercentage?: number;
    purchaseCount: number;
    isBlocked: boolean;
    isApproved: boolean;
    videos: Video[];
    reviews: Review[];
    comments: Comment[];
}