"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkExperienceSchema = void 0;
const mongoose_1 = require("mongoose");
exports.WorkExperienceSchema = new mongoose_1.Schema({
    institution: { type: String, required: true },
    designation: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
});
