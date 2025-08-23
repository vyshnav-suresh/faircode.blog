import { Router } from "express";
import authRoutes from "./auth/auth.routes";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the boilerplate!" });
});
router.use("/auth", authRoutes);
export default router;