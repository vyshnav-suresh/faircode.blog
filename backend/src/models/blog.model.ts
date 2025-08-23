import { Schema, model, Document, Types } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  tags?: string[];
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

const Blog = model<IBlog>("Blog", blogSchema);
export default Blog;
