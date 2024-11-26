import axios from "axios";

export default function chatService() {
    return {
        async getChatGroups() {
            try {
                const response = await axios.get('/api/chat/get');
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        },
        async createChatGroup(name) {
            try {
                const response = await axios.post('/api/chat/create', { name });
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        },
        async joinChatGroup(id) {
            try {
                const response = await axios.post('/api/chat/join', { id });
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        }, 
        async deleteChatGroup(id) {
            try {
                const response = await axios.delete(`/api/chat/delete/${id}`);
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        },
        async leaveChatGroup(id) {
            try {
                const response = await axios.post('/api/chat/leave', { id });
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        },
        async getMembers(id) {
            try {
                const response = await axios.get(`/api/chat/members/${id}`);
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        },
        async removeMember(chatId, memberId) {
            try {
                const response = await axios.post('/api/chat/remove-member', { chatId, memberId });
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        }
    }
}