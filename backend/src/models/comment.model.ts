import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema(
  {
    blog: { type: Types.ObjectId, ref: "Blog", required: true },
    author: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
