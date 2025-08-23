
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db";
import healthRoutes from "./src/routes/health.routes";
import authRoutes from "./src/routes/auth/auth.routes";
import { authenticateJWT, authorizeRoles } from "./src/middleware/auth";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import router from "./src/routes/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Swagger JSDoc options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FairCode Blog API",
      version: "1.0.0",
      description: "API documentation for the FairCode Blog backend",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    __dirname + "/src/routes/*.ts",
    __dirname + "/src/routes/auth/*.ts",
    __dirname + "/src/routes/user/*.ts",
    __dirname + "/src/routes/blog/*.ts"
  ], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

// Example: protected route (any logged-in user)
app.get("/api/protected", authenticateJWT, (req, res) => {
  res.json({ message: "You are authenticated!" });
});

// Example: admin-only route
app.get("/api/admin", authenticateJWT, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "You are an admin!" });
});

// connect DB & start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
