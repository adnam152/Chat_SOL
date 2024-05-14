import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// This middleware function is used to protect routes that REQUIRES AUTHENTICATION
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        if(!token) return res.status(401).json({message: "Unauthorized Access - No Token Provided"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({message: "Unauthorized Access - Invalid Token"});

        // Get user
        const user = await User.findById(decoded.id).select("-password");
        req.user = user;

        next();
    } 
    catch (error) {
        console.log("Error in protect Route: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export default protectRoute;