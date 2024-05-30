import messageModel from '../models/message.model.js';
import toast from 'react-hot-toast';

export default function useMessage() {
    async function getMessages({ receiverId, setMessages }) {
        try {
            const message = await messageModel.get(receiverId);
            setMessages(message.data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async function sendMessage({ receiverId, message, setMessages }) {
        try {
            const newMessage = await messageModel.send(receiverId, message);
            setMessages((prevMessages) => [newMessage.data, ...prevMessages]);
            return true;
        } 
        catch (error) {
            console.log(error);
            return false;
        }
    }

    return {
        getMessages,
        sendMessage
    }
}