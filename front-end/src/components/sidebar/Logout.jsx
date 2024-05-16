import React from 'react';
import { CiLogout } from "react-icons/ci";
import { useAuthContext } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import authModels from '../../models/auth.model.js';

function Logout() {
    const { authUser, setAuthUser } = useAuthContext();
    // Event handler for logout
    const handleLogout = async () => {
        try {
            const res = await authModels.logout();
            if(res.status === 200){
                // Remove user data from local storage
                localStorage.removeItem('auth-user');
                // Remove user data from context
                setAuthUser(null);
                toast.success(res.data.message);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='mt-3 flex items-center hover:underline hover:text-info cursor-pointer w-max select-none'
            onClick={handleLogout}
        >
            <CiLogout />
            <span className='ms-1'>Logout</span>
        </div>
    )
}

export default Logout