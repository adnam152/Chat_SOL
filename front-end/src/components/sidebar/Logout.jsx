import React from 'react';
import { CiLogout } from "react-icons/ci";
import { useAuthContext } from '../../context/AuthContext.jsx';
import useLogout from '../../hooks/useLogout.js';
import { useLoadingContext } from '../../context/LoadingContext.jsx';

function Logout() {
    const { setAuthUser } = useAuthContext();
    const { setLoading } = useLoadingContext();
    // Event handler for logout
    const handleLogout = async () => {
        const logout = useLogout(setAuthUser, setLoading);
        logout();
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