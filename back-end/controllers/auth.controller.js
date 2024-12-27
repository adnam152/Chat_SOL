import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateJwt from "../utils/generateJwt.js";

const login = async (req, res) => {
    try {
        const { walletAddress } = req.body;
        console.log(walletAddress)
        let user = await User.findOne({ walletAddress });
        if (!user) {
            // Create new User
            const newUser = new User({
                walletAddress,
                fullname: 'U' + walletAddress.slice(0, 8) + Math.floor(Math.random() * 1000),
                avatar: `https://res.cloudinary.com/dzkdgm4c7/image/upload/v1731945251/DATN/rxkmkxsqet6xrc2sllry.jpg`,
            })
            if (!newUser) {
                console.log("Error creating user");
                return res.status(500).json({ message: "Error creating user" });
            }
            user = await newUser.save();
        }
        // Generate JWT
        generateJwt(user._id, res);
        // Send response
        res.status(200).json({
            message: "Logged in successfully",
            data: user,
        });
    }
    catch (error) {
        console.log("Error Login Controller: ", error.message);
        res.status(500).json({ message: "Error logging in" });
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie("auth_token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error Logout Controller: ", error.message);
        res.status(500).json({ message: "Error logging out" });
    }
}

const update = async (req, res) => {
    try {
        const user = req.user;
        console.log('user update', user);
        const { fullname, avatar } = req.body;
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        user.fullname = fullname;
        if (avatar) user.avatar = avatar;
        await user.save();
        res.status(200).json({ message: "User updated successfully", data: user });
    }
    catch (error) {
        console.log("Error Update Controller: ", error.message);
        res.status(500).json({ message: "Error updating user" });
    }
}

export default { login, logout, update };