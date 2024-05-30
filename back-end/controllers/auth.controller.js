import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateJwt from "../utils/generateJwt.js";

const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isCorrectPassword = user && await bcrypt.compare(password, user.password);
        if(!user || !isCorrectPassword) {
            console.log("Username or password is incorrect");
            return res.status(400).json({message: "Username or password is incorrect"});
        }
        // Generate JWT
        generateJwt(user._id, res);
        // Send response
        const tempUser = user.toObject();
        delete tempUser.password;
        res.status(200).json({
            message: "Logged in successfully",
            user: tempUser,
        });
    } 
    catch (error) {
        console.log("Error Login Controller: ", error.message);
        res.status(500).json({message: "Error logging in"});
    }
}

const signup = async (req, res) => {
    try {
        const {username, password, confirmPassword, fullname, gender} = req.body;
        // Check if all fields are filled
        if(!username || !password || !confirmPassword || !fullname || !gender) {
            console.log("Fields are not filled");
            return res.status(400).json({message: "Please fill in all fields"});
        }
        // Check confirm password
        if(password !== confirmPassword) {
            console.log("Password doesn't match");
            return res.status(400).json({message: "Password doesn't match"});
        }
        // Check password length
        if(password.length < 6) {
            console.log("Password length is less than 6");
            return res.status(400).json({message: "Password length is less than 6"});
        }
        // Check if user already exists
        const existingUser = await User.findOne({username});
        if(existingUser) {
            console.log("User already exists");
            return res.status(409).json({message: "User already exists"});
        }
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const HashedPassword = await bcrypt.hash(password, salt);
        // Create Profile Picture
        const profilePictureUrl = `https://avatar.iran.liara.run/username?username=${username}`;
        // Create new User
        const newUser = new User({
            username,
            password : HashedPassword,
            fullname,
            gender,
            profilePicture: profilePictureUrl,
        })
        if(!newUser) {
            console.log("Error creating user");
            return res.status(500).json({message: "Error creating user"});
        }
        // Generate JWT
        generateJwt(newUser._id, res);
        // Save to MongoDB
        await newUser.save(); 
        const tempUser = newUser.toObject();
        delete tempUser.password;
        res.status(201).json({
            message: "User created successfully",
            user: tempUser,
        });
    } 
    catch (error) {
        console.error("Error Signup Controller: ", error.message);
        res.status(500).json({message: "Error creating user"});
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie("auth_token");
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error Logout Controller: ", error.message);
        res.status(500).json({message: "Error logging out"});
    }
}


export default { login, signup, logout };