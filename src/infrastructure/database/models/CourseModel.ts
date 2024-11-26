import mongoose, { Schema, Document } from 'mongoose';

export interface Review {
    rating: number;
    comment: string;
    userId: string;
}
  
export interface Comment {
    content: string;
    userId: string;
}

export interface CourseDocument extends Document {
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
    videos: {
        title: string;
        description: string;
        url: string;
    }[];
    reviews: Review[];
    comments: Comment[];
}

const reviewSchema: Schema = new Schema({
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { 
        type: String 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    }
}, { timestamps: true });

const commentSchema: Schema = new Schema({
    content: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    }
}, { timestamps: true });

const courseSchema: Schema = new Schema({
    tutorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tutor', 
        required: true
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    shortDescription: { 
        type: String, 
        required: true 
    },
    tags: [{ 
        type: String 
    }],
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'CourseCategory', 
        required: true
    },
    price: { 
        type: Number, 
        required: true 
    },
    offerPercentage: { 
        type: Number, 
        default: 0 
    },
    purchaseCount: { 
        type: Number, 
        default: 0 
    },
    level: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isListed: {
        type: Boolean,
        default: false,
    },
    videos: [{
        title: { 
            type: String, 
            required: true
        },
        description: { 
            type: String, 
            required: true
        },
        url: { 
            type: String, 
            required: true
        }
    }],
    reviews: [reviewSchema],
    comments: [commentSchema],
}, { timestamps: true });
  
export const CourseModel = mongoose.model<CourseDocument>('Course', courseSchema);