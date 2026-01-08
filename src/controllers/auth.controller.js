import { User } from "../model/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({
                message: "User already existed"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(200).json({
            message: "User registered successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json("User doesn't exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "Password not matched"
        })
    }
    const accessToken = jwt.sign(
        {
            userId: user._id
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "15m" }
    )

    const refreshToken = jwt.sign(
        {
            userId: user._id
        },
        process.env.REFRESH_TOKEN,
        { expiresIn: "30d" }
    )

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSize: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message: "User login successfully",
        accessToken
    })
}

export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (token) {
        const user = await User.findOne({ refreshToken: token });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
    }
    res.clearCookie("refreshToken");

    return res.status(200).json({
        message: "logout successfully"
    })
}

export const refresh = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const newAccessToken = jwt.sign(
        {
            userId: user._id, role: user.role
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: "15m"
        }
    )
    return res.status(200).json({ accessToken: newAccessToken })
}