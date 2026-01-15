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

// CORS Configuration
const allowedOrigins = [
    "http://localhost:3000", // Local development 
    "https://shishu-doctor.vercel.app", // Deployed frontend
    "https://shishudoctorbackend-trga.vercel.app", // Allow requests from backend itself

];

// Use CORS middleware with proper configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Handle preflight requests
// app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);

// Health check
app.get("/", (_req, res) => {
    res.send("API running successfully 🚀");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

export default app;