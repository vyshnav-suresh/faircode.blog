import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";
import blogRoutes from "./blog/blog.routes";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the boilerplate!" });
});
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/blog", blogRoutes);
export default router;