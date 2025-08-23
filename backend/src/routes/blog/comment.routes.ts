import { Router } from "express";
import Comment from "../../models/comment.model";
import Blog from "../../models/blog.model";
import { authenticateJWT } from "../../middleware/auth";

const router = Router();

// Add a comment to a blog post
router.post("/:blogId", authenticateJWT, async (req: any, res) => {
  const { blogId } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "Content required" });
  const blog = await Blog.findOne({ _id: blogId, deleted: false });
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  const comment = await Comment.create({
    blog: blogId,
    author: req.user.userId,
    content
  });
  res.status(201).json(comment);
});

// Get all comments for a blog post
router.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const comments = await Comment.find({ blog: blogId, deleted: false })
    .populate("author", "username")
    .sort({ createdAt: 1 });
  res.json(comments);
});

// Edit a comment (only author)
router.patch("/:commentId", authenticateJWT, async (req: any, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const comment = await Comment.findOne({ _id: commentId, deleted: false });
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user.userId) return res.status(403).json({ message: "Forbidden" });
  if (!content) return res.status(400).json({ message: "Content required" });
  comment.content = content;
  await comment.save();
  res.json(comment);
});

// Delete a comment (soft delete, only author)
router.delete("/:commentId", authenticateJWT, async (req: any, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId, deleted: false });
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user.userId) return res.status(403).json({ message: "Forbidden" });
  comment.deleted = true;
  comment.deletedAt = new Date();
  await comment.save();
  res.json({ message: "Comment deleted" });
});

export default router;
