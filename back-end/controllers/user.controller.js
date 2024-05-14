import Conversation from "../models/conversation.model.js";

export const getUserForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const conversations = await Conversation.find({members: loggedInUserId}).populate("members", "fullname profilePicture");

        res.status(200).json(conversations)
    } 
    catch (error) {
        console.log("Error User Controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}