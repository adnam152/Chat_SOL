import toast from "react-hot-toast";
import authModels from '../models/auth.model.js';

function useLogin(setAuthUser, setLoading) {
    const login = async (inputs) => {
        if (validate(inputs)) {
            setLoading(true);
            try {
                const res = await authModels.login(inputs);
                // Save user data to local storage
                localStorage.setItem('auth-user', JSON.stringify(res.data.user));
                // Set user data to context
                setAuthUser(res.data.user);
                toast.success(res.data.message);
            }
            catch (error) {
                toast.error(error.response.data.message);
            }
            finally {
                setLoading(false);
            }
        }
    }
    return login;
}

export default useLogin;

function validate({username, password}) {
    if(username.trim() === '' || password.trim() === '') {
        toast.error('Please fill all fields');
        return false;
    }
    if(username.length < 3) {
        toast.error('Username must be at least 4 characters');
        return false;
    }
    if(password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }
    return true;
}