"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectSchema = void 0;
const mongoose_1 = require("mongoose");
exports.SubjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    level: { type: String, required: true }
});
