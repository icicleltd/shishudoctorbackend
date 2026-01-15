"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const visitorRoutes_1 = __importDefault(require("./routes/visitorRoutes"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
/**
 * 🔴 VERY IMPORTANT
 * Real client IP পাওয়ার জন্য
 * (Vercel / Nginx / Proxy / Cloudflare)
 */
app.set("trust proxy", true);
// Middleware
app.use((req, res, next) => {
    const allowedOrigins = [
        "http://localhost:3000", // Local development
        "https://shishu-doctor.vercel.app", // Deployed frontend
    ];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // Dynamically set the origin
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    else {
        res.setHeader("Access-Control-Allow-Origin", "null"); // Reject unauthorized origins
    }
    // Handle preflight OPTIONS requests
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});
app.use(express_1.default.json());
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/visitors", visitorRoutes_1.default);
// Health check
app.get("/", (_req, res) => {
    res.send("API running successfully 🚀");
});
exports.default = app;
