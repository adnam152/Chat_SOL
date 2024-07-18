import axios from "axios";

export default function authAPI() {
    return {
        async signup(inputs) {
            try {
                const response = await axios.put('/api/auth/signup', inputs);
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async login(inputs) {
            try {
                const response = await axios.post('/api/auth/login', inputs);
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async logout() {
            try {
                const response = await axios.post('/api/auth/logout');
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async checkLogin(){
            try {
                const response = await axios.post('/api/check');
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
}