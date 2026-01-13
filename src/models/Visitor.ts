// src/models/Visitor.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IVisitor extends Document {
  ip: string;
  country: string;
  date: Date;
}

const visitorSchema: Schema = new Schema(
  {
    ip: { type: String, required: true },
    country: { type: String, required: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

// 🔒 One IP → One Visit → Per Day
visitorSchema.index({ ip: 1, date: 1 }, { unique: true });

export const Visitor = mongoose.model<IVisitor>("Visitor", visitorSchema);
