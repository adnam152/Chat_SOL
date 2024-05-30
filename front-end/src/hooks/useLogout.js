import toast from "react-hot-toast";
import authModels from '../models/auth.model.js';

function useLogout(setAuthUser, setLoading) {
    const logout = async () => {
        setLoading(true);
        try {
            const res = await authModels.logout();
            if(res.status === 200){
                // Remove user data from context
                setAuthUser(null);
                toast.success(res.data.message);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }
    return logout;
}

export default useLogout;