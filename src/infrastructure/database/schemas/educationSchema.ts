import { Schema } from "mongoose";

export const EducationSchema: Schema = new Schema({
  level: { type: String, required: true },
  board: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  grade: { type: String, required: true },
  institution: { type: String, required: true }
});