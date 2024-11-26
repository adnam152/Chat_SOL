import axios from "axios";

export async function getGame(chatId) {
    try {
        const response = await axios.get(`/api/game/get/${chatId}`);
        return response.data;
    } catch (error) {
        if (error.response) return error.response.data;
        return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
    }
}

export async function createGame(chatId, stakeAmount) {
    try {
        const response = await axios.post(`/api/game/create`, {chatId, stakeAmount });
        return response.data;
    } catch (error) {
        if (error.response) return error.response.data;
        return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
    }
}

export async function bet(gameId, bet) {
    try {
        const response = await axios.post(`/api/game/bet`, { gameId, bet });
        return response.data;
    } catch (error) {
        if (error.response) return error.response.data;
        return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
    }
}

export async function getResult(gameId) {
    try {
        const response = await axios.get(`/api/game/result/${gameId}`);
        return response.data;
    } catch (error) {
        if (error.response) return error.response.data;
        return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
    }
}