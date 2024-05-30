import React, { useCallback } from 'react';
import { useAuthContext } from '../../context/AuthContext';

function Message({message, chattingUser}) {
    const { authUser } = useAuthContext();
    const isSender = authUser._id === message.senderId;
    const img = isSender ? authUser.profilePicture : chattingUser.profilePicture;
    // convert time to miniutes after
    const time = new Date(message.createdAt);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const date = time.getDate();
    const month = time.getMonth();
    // message.createdAt = `${hours}:${minutes} ${date}/${month}`;
    console.log("Re-render Message");

    // Chat Position Class
    let chatPosition = 'chat ';
    chatPosition += isSender ? 'chat-end' : 'chat-start';

    // // Chat Bubble Background Class
    let chatBubble = 'chat-bubble hover:bg-opacity-80 ';
    chatBubble += isSender ? 'bg-indigo-700 text-white' : 'bg-gray-300 text-neutral';

    // Event Handler
    const toggleTime = useCallback((e) => {
        const timeElm = e.target.closest('.chat').querySelector('time');
        timeElm.classList.toggle('hidden');
    })


    return (
        <div className={chatPosition}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={img} />
                </div>
            </div>
            <div className={chatBubble} onClick={toggleTime}>
                {message.message}
            </div>
            <div className="chat-footer opacity-50">
                <time className="text-xs hidden">{message.createdAt}</time>
            </div>
        </div>
    )
}

export default Message