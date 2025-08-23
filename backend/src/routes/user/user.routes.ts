import { Router } from "express";
import User from "../../models/user.model";
import { authenticateJWT, authorizeRoles } from "../../middleware/auth";

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management and profile endpoints
 */
const router = Router();

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/", authenticateJWT, authorizeRoles("admin"), async (req, res) => {
  const users = await User.find({ deleted: false }, "_id username email role");
  res.json(users);
});

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get authenticated user's details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticateJWT, async (req: any, res) => {
  const user = await User.findOne({ _id: req.user.userId, deleted: false }, "_id username email role");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

/**
 * @swagger
 * /api/user/me:
 *   patch:
 *     summary: Update authenticated user's details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.patch("/me", authenticateJWT, async (req: any, res) => {
  const updates: any = {};
  if (req.body.username) updates.username = req.body.username;
  if (req.body.email) updates.email = req.body.email;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No updates provided" });
  }
  try {
    const user = await User.findOneAndUpdate({ _id: req.user.userId, deleted: false }, updates, { new: true, select: "_id username email role" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Invalid input", error: err });
  }
});

/**
 * @swagger
 * /api/user/me:
 *   delete:
 *     summary: Delete authenticated user's account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/me", authenticateJWT, async (req: any, res) => {
  const user = await User.findOneAndUpdate({ _id: req.user.userId, deleted: false }, { deleted: true });
  if (!user) return res.status(404).json({ message: "User not found or already deleted" });
  res.json({ message: "User soft deleted successfully" });
});

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete any user (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: User not found
 */
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndUpdate({ _id: id, deleted: false }, { deleted: true });
  if (!user) return res.status(404).json({ message: "User not found or already deleted" });
  res.json({ message: "User soft deleted successfully" });
});

export default router;
