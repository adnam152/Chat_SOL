import React from 'react'


const Conversation = React.memo(({ conversation, onSelectConversation }) => {
    console.log(conversation);
    let isRead = true;
    const oppositeUser = conversation.oppositeUser;
    if(conversation?.lastMessage?.senderId === oppositeUser._id && !conversation.isRead) {
        isRead = false;
    }

    return (
        <div className='border-b border-gray-400 mt-2 flex items-center p-3 w-72 hover:bg-sky-600 cursor-pointer select-conversation'
            onClick={(event) => onSelectConversation(conversation, event)}
        >
            <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                    <img src={oppositeUser.profilePicture} />
                </div>
            </div>

            <div className="flex-1 ms-3">
                <div className="font-bold text-sm">{oppositeUser.fullname}</div>
            </div>

            <span className={`relative flex h-3 w-3 ${isRead ? 'hidden' : ''}`}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-300"></span>
            </span>
        </div>
    )
})

export default Conversation;