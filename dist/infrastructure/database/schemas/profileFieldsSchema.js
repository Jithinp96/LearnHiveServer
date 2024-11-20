"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileFieldsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ProfileFieldsSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    mobile: { type: Number, required: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    profileImage: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_1280.png"
    },
}, { _id: false });
