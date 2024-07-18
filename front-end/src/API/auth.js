import axios from "axios";

export default function authAPI() {
    return {
        async signup(inputs) {
            try {
                const response = await axios.put('http://localhost:5000/api/auth/signup', inputs);
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async login(inputs) {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/login', inputs);
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async logout() {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/logout');
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async checkLogin(){
            try {
                const response = await axios.post('http://localhost:5000/api/check');
                return response.data;
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
}