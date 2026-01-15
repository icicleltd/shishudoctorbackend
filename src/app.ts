import express, { type NextFunction, type Request, type Response } from "express";
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
app.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins: string[] = [
        "*",
        "http://localhost:3000", // Local development
        "https://shishu-doctor.vercel.app", // Deployed frontend
    ];
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // Dynamically set the origin
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );
        res.setHeader("Access-Control-Allow-Credentials", "true");
    } else {
        res.setHeader("Access-Control-Allow-Origin", "null"); // Reject unauthorized origins
    }

    // Handle preflight OPTIONS requests
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
});
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);

// Health check
app.get("/", (_req, res) => {
    res.send("API running successfully 🚀");
});

export default app;
