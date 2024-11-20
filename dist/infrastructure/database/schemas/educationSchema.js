"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.EducationSchema = new mongoose_1.Schema({
    level: { type: String, required: true },
    board: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    grade: { type: String, required: true },
    institution: { type: String, required: true }
});
