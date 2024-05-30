import React, { useCallback } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { useAuthContext } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SoketContext';

function Conversation({ conversation }) {
    const { setSelectedChat } = useHomeContext();
    const { online } = useSocketContext();
    const { authUser } = useAuthContext();
    const receiver = conversation.members.find((member) => member._id !== authUser._id);

    // Check if user is online
    const isOnline = online.includes(receiver._id);
    
    // Event Handler
    const handleEventClick = useCallback((e) => {
        document.querySelector('.select-conversation.bg-sky-600')?.classList.remove('bg-sky-600');
        if (e.target.classList.contains('select-conversation')) {
            e.target.classList.add('bg-sky-600');
        } else {
            e.target.closest('.select-conversation').classList.add('bg-sky-600');
        }
        setSelectedChat(conversation);
    }, [])

    return (
        <div className='border-b border-gray-400 mt-2 flex items-center p-3 w-72 hover:bg-sky-600 cursor-pointer select-conversation'
            onClick={handleEventClick}
        >
            <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
                <div className="w-8 h-8 rounded-full">
                    <img src={receiver.profilePicture} />
                </div>
            </div>

            <div className="flex-1 ms-3">
                <div className="font-bold text-sm">{receiver.fullname}</div>
            </div>
        </div>
    )
}

export default Conversation