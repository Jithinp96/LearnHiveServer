import mongoose, { Schema, Document } from "mongoose";

interface OTPDocument extends Document {
    email: string;
    otp: number;
    expiresAt: Date;
}

const OTPSchema: Schema = new Schema ({
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    expiredAt: { type: Date, required: true }
})

OTPSchema.index({expiresAt: 1}, {expireAfterSeconds: 60});

export const OTPModel = mongoose.model<OTPDocument>("OTP", OTPSchema);