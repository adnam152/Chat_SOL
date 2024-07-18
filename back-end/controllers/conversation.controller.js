import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const getConversationForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        let conversations = await Conversation.find({ members: loggedInUserId }, { createdAt: 1, updatedAt: 1, lastMessage: 1, isRead: 1})
            .populate("members", "username fullname profilePicture")
            .populate("lastMessage", "senderId receiverId createdAt");
        conversations = conversations.map(conversation => {
            const oppositeUser = conversation.members.find(member => member._id.toString() !== loggedInUserId.toString());
            return {
                _id: conversation._id,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
                lastMessage: conversation.lastMessage,
                isRead: conversation.isRead,
                oppositeUser
            }
        });

        res.status(200).json({message: "Success", conversations});
    }
    catch (error) {
        console.log("Error Conversation Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getConversationByUsername = async (req, res) => {
    const usernameParam = req.params.username;
    const loggedInUsername = req.user.username;

    // check if the username is the same as the logged in user
    if (usernameParam === loggedInUsername) {
        return res.status(403).json({ message: "You cannot search yourself" });
    }

    try {
        // find the user with the username
        const searchUser = await User.findOne({ username: usernameParam }).select("_id");
        if (!searchUser) {
            return res.status(200).json({ message: "Not found" });
        }
        // find the conversation with the username
        let conversation = await Conversation.findOne({ members: { $all: [req.user._id, searchUser._id] } })
            .populate("lastMessage", "senderId receiverId createdAt")
        if (!conversation) {
            // Create a new conversation
            conversation = new Conversation({
                members: [req.user._id, searchUser._id]
            });
            await conversation.save();
        }
        // Get infor opposite user
        const oppositeId = conversation.members.find(member => member.toString() !== req.user._id.toString());
        const oppositeUser = await User.findById(oppositeId).select("username fullname profilePicture");

        res.status(200).json({
            message: "Success",
            conversation: {
                _id: conversation._id,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
                lastMessage: conversation.lastMessage,
                isRead: conversation.isRead,
                oppositeUser
            }
        });
    }
    catch (error) {
        console.log("Error Conversation Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const setReadLastMessage = async (req, res) => {
    const conversationId = req.params.conversationId;
    try {
        const conversation = await Conversation.findById(conversationId).populate("lastMessage");
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        if (!conversation.members.includes(req.user._id)) {
            return res.status(403).json({ message: "You are not a member of this conversation" });
        }
        if (!conversation.lastMessage) {
            return res.status(404).json({ message: "No message in this conversation" });
        }
        if (conversation.lastMessage.receiverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not the receiver of this message" });
        }
        conversation.isRead = true;
        await conversation.save();
        res.status(200).json({ message: "Success" });
    }
    catch (error) {
        console.log("[Conversation Controller]: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}