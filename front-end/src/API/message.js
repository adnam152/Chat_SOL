import axios from "axios";

export default function messageAPI() {
    return {
        async getMessages(oppositeUserId) {
            try {
                const response = await axios.get(`http://localhost:5000/api/message/${oppositeUserId}`);
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async sendMessage(oppositeUserId, message) {
            try {
                const response = await axios.post(`http://localhost:5000/api/message/send/${oppositeUserId}`, { message });
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
}
