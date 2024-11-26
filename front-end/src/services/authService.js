import axios from "axios";

export default function authService() {
    return {
        async logout() {
            try {
                const response = await axios.post('/api/auth/logout');
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        },
        async checkLogin() {
            try {
                const response = await axios.post('/api/check');
                return response.data;
            } catch (error) {
                if (error.response) return error.response.data;
                return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
            }
        },
    }
}

export const loginWithPhantomWallet = async (publicKey) => {
    try {
        const response = await axios.post('/api/auth/login', { walletAddress: publicKey });
        return response.data;
    } catch (error) {
        if (error.response) return error.response.data;
        return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
    }
}

export const updateInfor = async (payload) => {
    try {
        const response = await axios.put('/api/auth/update', payload);
        return response.data;
    } catch (error) {
        if (error.response) return error.response.data;
        return { message: 'Không thể kết nối với server, vui lòng thử lại.' };
    }
}