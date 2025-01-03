import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long!"});
        }
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: "Email already exists!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });
        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({ 
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: "Invalid user data!" });
        }
    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        return res.status(500).json({ message: "Internal server error!" });
    }
}

export const login = (req, res) => {
    
}

export const logout = (req, res) => {
    
}