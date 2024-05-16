import React from 'react';
import { useHomeContext } from '../../context/HomeContext';

function Conversation() {
    const { setSelectedChat } = useHomeContext();

    // event handler to select a conversation
    const selectConversation = (e) => {
        document.querySelector('.select-conversation.bg-sky-600')?.classList.remove('bg-sky-600');
        if (e.target.classList.contains('select-conversation')) {
            e.target.classList.add('bg-sky-600');
        }else{
            e.target.closest('.select-conversation').classList.add('bg-sky-600');
        }
        setSelectedChat(true);
    }
    return (
        <div className='border-b border-gray-400 mt-2 flex items-center p-3 w-72 hover:bg-sky-600 cursor-pointer select-conversation' 
            onClick={selectConversation}
        >
            <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
            </div>

            <div className="flex-1 ms-3">
                <div className="font-bold text-sm">John Doe</div>
            </div>
        </div>
    )
}

export default Conversation