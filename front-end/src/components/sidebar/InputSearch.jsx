import React from 'react';
import { FaSearch } from "react-icons/fa";

function InputSearch() {
    return (
        <form className='flex-initial'>
            <div className='flex items-center'>
                <input type="text" placeholder="Search..." className="input rounded-full input-bordered input-primary max-w-xs w-64 h-9 bg-black text-gray-200" />
                <button type='button' className='btn btn-primary ms-2 rounded-full h-9 min-h-9'>
                    <FaSearch />
                </button>
            </div>
        </form>
    )
}

export default InputSearch