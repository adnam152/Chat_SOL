import axios from "axios";

export default {
    async getConversations() {
        return await axios.get('http://localhost:5000/api/conversation');
    }
}
