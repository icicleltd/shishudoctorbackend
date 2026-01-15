import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generateToken";

// ================= REGISTER =================
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // 🔒 role validation
        if (role && !["admin", "user"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Plain password:", password);
        console.log("Hashed password:", hashedPassword);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString(), user.role),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ================= LOGIN =================
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        // 🔒 role validation
        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 🔐 password check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 🔒 role must match DB
        if (user.role !== role) {
            return res.status(403).json({ message: "Unauthorized role access" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString(), user.role),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
