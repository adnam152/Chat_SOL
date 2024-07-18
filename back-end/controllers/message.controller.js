import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket/socket.js";

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id.toString();

        if(!message || !receiverId || !senderId) return res.status(400).json({ message: "All fields are required" });
        if(senderId === receiverId) return res.status(400).json({ message: "You cannot send message to yourself" });

        let conversation = await Conversation.findOne({
            members: {
                $all: [senderId, receiverId]
            }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                members: [senderId, receiverId]
            });
        }
        // Create new message
        const createMessage = new Message({senderId, receiverId, message});
        if(createMessage){
            conversation.messages.push(createMessage._id);
        }
        await createMessage.save(); // Save message and get lastMessage
        const lastMessage = await Message.findById(createMessage._id).populate();

        // add lastMessage to conversation and save
        conversation.lastMessage = lastMessage;
        conversation.isRead = false;
        conversation.save();

        res.status(201).json(lastMessage);

        // SOCKET
        const socketId = getSocketId(receiverId);
        if(socketId) {
            io.to(socketId).emit('newMessage', {
                lastMessage,
                conversation_id: conversation._id
            });
        }

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
        }).populate({
            path: "messages",
            options: {
                sort: { createdAt: -1 }
            }
        });

        if(!conversation) return res.status(200).json([]);
        res.status(200).json(conversation.messages);
    } 
    catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export {sendMessage, getMessages};