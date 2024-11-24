import mongoose, { Schema, Document } from "mongoose";

interface CourseProgress extends Document {
  studentId: string;
  courseId: string;
  completedVideos: string[];
  totalVideos: number;
  progressPercentage: number;
  isCompleted: boolean;
  lastWatchedVideo: string | null;
  lastAccessedDate: Date;
}

const CourseProgressSchema: Schema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  completedVideos: {
    type: [Schema.Types.ObjectId],
    ref: "Video",
    default: []
  },
  totalVideos: {
    type: Number,
    required: true
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  lastWatchedVideo: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    default: null
  },
  lastAccessedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const CourseProgress = mongoose.model<CourseProgress>("CourseProgress", CourseProgressSchema);