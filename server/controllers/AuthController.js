import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


//REGISTER
export const registerUser = async (req, res, next) => {
    // Step 1: Handle completely empty body
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
    }

    const { name, email, password, role } = req.body;
    //if anyone of the field is empty
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields",
        });
    }


    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
    }

    //invalid password
    if (password.length < 8 || password.length > 16) {
        res.status(400).json({
            success: false,
            message: "Password must be between 8 to 16 characters",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "Manager",
    });

    return res.status(200).json({
        success: true,
        message: "User registered succesfully",
        user: user.email,
    });

}

//LOGIN
export const loginUser = async (req, res, next) => {

    // Step 1: Handle completely empty body
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
    }
    const { email, password } = req.body;

    //if anyone of the field is empty
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields",
        });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User not found",
        });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    },
        process.env.JWT_SECRET,
        { expiresIn: Date.now() + 15 * 60 * 60 * 100, }
    )

    return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            // id:user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
}

//LOGOUT
export const logoutUser = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Logout successful"
    })
}