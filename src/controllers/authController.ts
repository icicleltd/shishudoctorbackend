import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString())
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString())
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};
