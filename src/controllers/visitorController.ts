// src/controllers/visitorController.ts
import { Request, Response } from "express";
import geoip from "geoip-lite";
import { Visitor } from "../models/Visitor";

/**
 * Add a visitor (daily unique by IP)
 */
export const addVisitor = async (req: Request, res: Response) => {
    try {
        // 🔹 Get real IP (supports proxy)
        const ip =
            (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
            req.socket.remoteAddress ||
            "unknown";

        // 🔹 Normalize date → start of today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 🔹 Detect country from IP
        const geo = geoip.lookup(ip);
        const country = geo?.country || "Unknown";

        // 🔹 Create visitor (MongoDB unique index prevents duplicates)
        await Visitor.create({
            ip,
            country,
            date: today
        });

        res.status(201).json({ counted: true });
    } catch (err: any) {
        // Duplicate key → already counted today
        if (err.code === 11000) {
            return res.json({ counted: false });
        }
        console.error("Visitor error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * Get visitor statistics
 */
export const getVisitorCounts = async (req: Request, res: Response) => {
    try {
        // 🔹 Today (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 🔹 Total visitors
        const total = await Visitor.countDocuments();

        // 🔹 Today's visitors
        const todayCount = await Visitor.countDocuments({ date: today });

        // 🔹 Country-wise count
        const countryWise = await Visitor.aggregate([
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            total,
            today: todayCount,
            countryWise
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
