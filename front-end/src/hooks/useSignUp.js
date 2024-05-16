import toast from "react-hot-toast";
import authModels from '../models/auth.model.js';


function useSignUp(setAuthUser) {
    const signUp = async (inputs) => {
        if (validate(inputs)) {
            try {
                const res = await authModels.signUp(inputs);
                // Save user data to local storage
                localStorage.setItem('auth-user', JSON.stringify(res.data.user));
                // Set user data to context
                setAuthUser(res.data.user);
                toast.success(res.data.message);
            }
            catch (error) {
                toast.error(error.response.data.message);
            }
        }
    }
    return signUp;
}

export default useSignUp;

function validate({ username, password, confirmPassword, fullname, gender }) {
    if (!username || !password || !confirmPassword || !fullname || !gender) {
        toast.error('All fields are required');
        return false;
    }
    if (password !== confirmPassword) {
        toast.error('Password does not match');
        return false;
    }
    if (username.length < 3) {
        toast.error('Username must be at least 4 characters');
        return false;
    }
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }

    return true;
}