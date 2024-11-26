import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.put('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.put('/update', authMiddleware, authController.update);

export function checkLogin(req, res) {
    try {
        const user = req.user;
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json({ message: "User is logged in", data: user });
    }
    catch (error) {
        console.log("Error Check Controller: ", error.message);
        res.status(500).json({ message: "Error checking user" });
    }
}

export default router;