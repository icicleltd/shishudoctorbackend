import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name?: string;
    email: string;
    password: string;
    role: "admin" | "user";
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"], // 🔒 only two roles
            default: "user",
        },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
