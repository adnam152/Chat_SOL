import axios from "axios";

export default {
    async signUp(inputs) {
        return await axios.put('http://localhost:5000/api/auth/signup', inputs);
    },
    async login(inputs) {
        return await axios.post('http://localhost:5000/api/auth/login', inputs);
    },
    async logout() {
        return await axios.post('http://localhost:5000/api/auth/logout');
    },
    async checkLogin(){
        return await axios.get('http://localhost:5000/api/check');
    }
}