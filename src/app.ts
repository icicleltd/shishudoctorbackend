import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import visitorRoutes from "./routes/visitorRoutes";

dotenv.config();
connectDB();

const app = express();

/**
 * 🔴 VERY IMPORTANT
 * Real client IP পাওয়ার জন্য
 * (Vercel / Nginx / Proxy / Cloudflare)
 */
app.set("trust proxy", true);

// Middleware
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);

// Health check
app.get("/", (_req, res) => {
    res.send("API running successfully 🚀");
});

export default app;
