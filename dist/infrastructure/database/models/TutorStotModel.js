"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorSlotModel = void 0;
const mongoose_1 = require("mongoose");
const TutorSlotSchema = new mongoose_1.Schema({
    tutorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    subject: { type: String, required: true },
    level: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', default: null },
    meetingId: { type: String, default: null },
    meetingLink: { type: String, default: null }
}, { timestamps: true });
exports.TutorSlotModel = (0, mongoose_1.model)('TutorSlot', TutorSlotSchema);
