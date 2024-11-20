"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorSlotPreferenceModel = void 0;
const mongoose_1 = require("mongoose");
const TutorSlotPreferenceSchema = new mongoose_1.Schema({
    tutorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    subject: { type: String, required: true },
    endDate: { type: Date, required: true },
    level: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    requiresDailySlotCreation: { type: Boolean, default: false }
}, { timestamps: true });
exports.TutorSlotPreferenceModel = (0, mongoose_1.model)('TutorSlotPreference', TutorSlotPreferenceSchema);
