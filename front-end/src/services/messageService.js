import axios from "axios";

export default function messageService() {
    return {
        async getMessages(chatId) {
            try {
                const response = await axios.get(`/api/message/get/${chatId}`);
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        },
        async sendMessage(chatId, content) {
            try {
                const response = await axios.post(`/api/message/send/${chatId}`, { content });
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        }
    }
}
