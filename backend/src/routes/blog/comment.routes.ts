import { Router } from "express";
import Comment from "../../models/comment.model";
import Blog from "../../models/blog.model";
import { authenticateJWT } from "../../middleware/auth";

/**
 * @swagger
 * tags:
 *   - name: Comment
 *     description: Blog post comments (authenticated users only for create/edit/delete)
 */
const router = Router();

/**
 * @swagger
 * /api/blog/{blogId}/comments:
 *   post:
 *     summary: Add a comment to a blog post (auth required)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Content required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */
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

/**
 * @swagger
 * /api/blog/{blogId}/comments:
 *   get:
 *     summary: Get all comments for a blog post
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Blog not found
 */
// Get all comments for a blog post
router.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const comments = await Comment.find({ blog: blogId, deleted: false })
    .populate("author", "username")
    .sort({ createdAt: 1 });
  res.json(comments);
});

/**
 * @swagger
 * /api/blog/{blogId}/comments/{commentId}:
 *   patch:
 *     summary: Edit a comment (auth required, only author)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 *       400:
 *         description: Content required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not author)
 *       404:
 *         description: Comment not found
 */
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

/**
 * @swagger
 * /api/blog/{blogId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment (auth required, only author, soft delete)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not author)
 *       404:
 *         description: Comment not found
 */
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
