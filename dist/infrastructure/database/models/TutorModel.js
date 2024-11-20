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
exports.TutorModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const profileFieldsSchema_1 = require("../schemas/profileFieldsSchema");
const educationSchema_1 = require("../schemas/educationSchema");
const subjectSchema_1 = require("../schemas/subjectSchema");
const workExperienceSchema_1 = require("../schemas/workExperienceSchema");
const TutorSchema = new mongoose_1.Schema(Object.assign(Object.assign({ tutorId: {
        type: String,
        required: true
    } }, profileFieldsSchema_1.ProfileFieldsSchema.obj), { role: { type: String, enum: ['Tutor'], default: 'Tutor' }, subjects: [subjectSchema_1.SubjectSchema], education: [educationSchema_1.EducationSchema], workExperience: [workExperienceSchema_1.WorkExperienceSchema] }), { timestamps: true });
exports.TutorModel = mongoose_1.default.model("Tutor", TutorSchema);
