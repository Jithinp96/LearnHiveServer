import mongoose, { Schema, Document } from 'mongoose';

interface Review {
    rating: number;
    comment: string;
    userId: string;
}
  
interface Comment {
    content: string;
    userId: string;
    createdAt: Date;
}

interface CourseDocument extends Document {
    tutorId: string;
    title: string;
    description: string;
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
    videos: {
        title: string;
        description: string;
        url: string;
    }[];
    reviews: Review[];
    comments: Comment[];
}

const courseSchema: Schema = new Schema({
    tutorId: { 
        type: String, 
        // required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    tags: [{ 
        type: String 
    }],
    category: { 
        type: String, 
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
    },
    duration: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    videos: [{
        title: { 
            type: String, 
            // required: true 
        },
        description: { 
            type: String, 
            // required: true 
        },
        url: { 
            type: String, 
            // required: true 
        }
    }],
    reviews: [{
        rating: { 
            type: Number, 
            required: true, 
            min: 1, max: 5 
        },
        comment: { 
            type: String 
        },
        userId: { 
            type: String, 
            required: true 
        }
    }],
    comments: [{
        content: { 
            type: String, 
            required: true 
        },
        userId: { 
            type: String, 
            required: true 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
    }],
}, { timestamps: true });
  
export const CourseModel = mongoose.model<CourseDocument>('Course', courseSchema);