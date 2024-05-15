import React from 'react';
import { CiLogout } from "react-icons/ci";

function Logout() {
    return (
        <div className='mt-3 flex items-center hover:underline hover:text-info cursor-pointer w-max select-none'>
            <CiLogout />
            <span className='ms-1'>Logout</span>
        </div>
    )
}

export default Logout