import axios from "axios";

export default {
    async get(receiverId){
        return await axios.get(`http://localhost:5000/api/message/${receiverId}`);
    },
    async send(receiverId, message){
        return await axios.post(`http://localhost:5000/api/message/send/${receiverId}`, {message});
    }
}