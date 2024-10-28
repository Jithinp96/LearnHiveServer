import { Schema } from "mongoose";

export const WorkExperienceSchema: Schema = new Schema({
  institution: { type: String, required: true },
  designation: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});