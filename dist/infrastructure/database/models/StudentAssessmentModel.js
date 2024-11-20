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
exports.StudentAssessmentModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ResponseSchema = new mongoose_1.Schema({
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    },
    selectedOption: {
        type: Number,
        required: true
    }
});
const StudentAssessmentSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    assessmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true
    },
    responses: {
        type: [ResponseSchema],
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['InProgress', 'Completed'],
        default: 'InProgress'
    },
    submittedDate: {
        type: Date
    }
}, { timestamps: true });
exports.StudentAssessmentModel = mongoose_1.default.model('StudentAssessment', StudentAssessmentSchema);
