import React from 'react'

function Message(props) {
    // Chat Position Class
    let chatPosition = 'chat ';
    chatPosition += props.isSender ? 'chat-end' : 'chat-start';

    // Chat Bubble Background Class
    let chatBubble = 'chat-bubble hover:bg-opacity-80 ';
    chatBubble += props.isSender ? 'bg-indigo-700 text-white' : 'bg-gray-300 text-neutral';

    // Event Handler
    const toggleTime = (e) => {
        const timeElm = e.target.closest('.chat').querySelector('time');
        timeElm.classList.toggle('hidden');
    }

    return (
        <div className={chatPosition}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
            </div>
            <div className={chatBubble} onClick={toggleTime}>{props.text}</div>
            <div className="chat-footer opacity-50">
                <time className="text-xs hidden">12:45</time>
            </div>
        </div>
    )
}

export default Message