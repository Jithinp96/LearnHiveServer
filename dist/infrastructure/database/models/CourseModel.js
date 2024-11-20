"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const reviewSchema = new mongoose_1.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }
}, { timestamps: true });
const commentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }
}, { timestamps: true });
const courseSchema = new mongoose_1.Schema({
    tutorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.CourseModel = mongoose_1.default.model('Course', courseSchema);
