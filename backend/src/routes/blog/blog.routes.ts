import { Router } from "express";
import Blog from "../../models/blog.model";
import { authenticateJWT } from "../../middleware/auth";
import commentRoutes from "./comment.routes";


/**
 * @swagger
 * tags:
 *   - name: Blog
 *     description: Blog CRUD and public listing
 */
const router = Router();

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: List all blogs (public, filterable)
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author userId
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.get("/", async (req, res) => {
  const { tag, author, title, page = 1, limit = 10 } = req.query;
  const filter: any = { deleted: false };
  if (tag) filter.tags = tag;
  if (author) filter.createdBy = author;
  if (title) filter.title = { $regex: new RegExp(title as string, "i") };
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const blogs = await Blog.find(filter)
    .populate("createdBy", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit as string));
  const total = await Blog.countDocuments(filter);
  res.json({
    data: blogs,
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    total,
    totalPages: Math.ceil(total / parseInt(limit as string))
  });
});

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: Get blog details (public)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog details
 *       404:
 *         description: Blog not found
 */
router.get("/:id", async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, deleted: false }).populate("createdBy", "username");
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
});

/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Create a blog (auth required)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Blog created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateJWT, async (req: any, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Title and content required" });
  const blog = new Blog({
    title,
    content,
    tags,
    createdBy: req.user.userId
  });
  await blog.save();
  res.status(201).json(blog);
});

/**
 * @swagger
 * /api/blog/{id}:
 *   patch:
 *     summary: Update a blog (auth required, only creator)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Blog updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not creator)
 *       404:
 *         description: Blog not found
 */
router.patch("/:id", authenticateJWT, async (req: any, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, deleted: false });
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  if (blog.createdBy.toString() !== req.user.userId) return res.status(403).json({ message: "Forbidden" });
  const { title, content, tags } = req.body;
  if (title) blog.title = title;
  if (content) blog.content = content;
  if (tags) blog.tags = tags;
  blog.updatedBy = req.user.userId;
  await blog.save();
  res.json(blog);
});

/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     summary: Soft delete a blog (auth required, only creator)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog soft deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not creator)
 *       404:
 *         description: Blog not found
 */
router.delete("/:id", authenticateJWT, async (req: any, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, deleted: false });
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  if (blog.createdBy.toString() !== req.user.userId) return res.status(403).json({ message: "Forbidden" });
  blog.deleted = true;
  blog.deletedBy = req.user.userId;
  await blog.save();
  res.json({ message: "Blog soft deleted" });
});

router.use("/:blogId/comments", commentRoutes);

export default router;
