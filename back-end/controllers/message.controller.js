import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id.toString();
        // console.log("Sender ID: ", senderId);
        // console.log("Receiver ID: ", receiverId);

        if(!message || !receiverId || !senderId) return res.status(400).json({ message: "All fields are required" });
        if(senderId === receiverId) return res.status(400).json({ message: "You cannot send message to yourself" });

        let conversation = await Conversation.findOne({
            members: {
                $all: [senderId, receiverId]
            }
        })
        if (!conversation) {
            // Create new conversation if it doesn't exist
            conversation = await Conversation.create({
                members: [senderId, receiverId]
            });
        }
        // Create new message
        const newMessage = new Message({senderId, receiverId, message});
        if(newMessage){
            // Add message to conversation
            conversation.messages.push(newMessage._id);
        }
        await Promise.all([newMessage.save(), conversation.save()]);
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getMessages = async (req, res) => {
    try {
        const senderId = req.user._id.toString();
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            members: {
                $all: [senderId, receiverId]
            }
        }).populate("messages");

        if(!conversation) return res.status(200).json([]);
        res.status(200).json(conversation.messages);
    } 
    catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export {sendMessage, getMessages};