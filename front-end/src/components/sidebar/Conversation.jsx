import React from 'react'

function Conversation() {
    return (
        <div className='border-b border-gray-400'>
            <div className='mt-2 flex items-center p-3 w-72 hover:bg-sky-600 cursor-pointer'>
                <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>

                <div className="flex-1 ms-3">
                    <div className="font-bold text-sm">John Doe</div>
                    {/* <div className="text-xs text-gray-300">Hello there! How are you?</div> */}
                </div>
            </div>

        </div>
    )
}

export default Conversation