import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

function Search({ onSubmitForm, onCancleSearch }) {
    const [input, setInput] = useState('');

    // Event Handlers
    const onInputChange = (e) => {
        setInput(e.target.value);
    };
    const clearInput = () => {
        setInput('');
        onCancleSearch();
    }

    return (
        <form className='flex-initial flex items-center'
            onSubmit={(e) => onSubmitForm(input, e)}
        >
            <div className='flex items-center bg-black rounded-full input-bordered'>
                <input type="text" placeholder="Search by username" className="input rounded-full input-bordered max-w-xs w-52 h-9 text-gray-200 bg-transparent"
                    value={input}
                    onChange={onInputChange}
                />
                <button type='submit' className='btn btn-primary rounded-full h-9 min-h-9'>
                    <FaSearch />
                </button>
            </div>

            <button type='button' className='btn btn-danger rounded-full h-9 min-h-9 ms-2 px-3'
                disabled={input.trim() === ''}
                onClick={clearInput}
            >
                <IoMdClose />
            </button>
        </form>
    )
}

export default Search