import { Schema } from "mongoose";

export const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  level: { type: String, required: true }
});