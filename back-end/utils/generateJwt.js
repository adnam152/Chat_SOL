import jwt from 'jsonwebtoken';

const generateAndSetCookies = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.cookie("auth_token", token, {
        path: '/',
        samesite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production" ? true : false,
    });
}

export default generateAndSetCookies;