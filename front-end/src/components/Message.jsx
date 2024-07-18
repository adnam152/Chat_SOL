import React, { useMemo, useState } from 'react'
import { useAuthContext } from '../contextProvider/useAuthContext';

function Message({ message, oppositeUser }) {
    const { authUser } = useAuthContext();
    const isSender = message.senderId === authUser._id;
    const position = isSender ? 'chat-end' : 'chat-start';
    const [hideTime, setHideTime] = useState(true);

    const createAtMemo = useMemo(() => {
        const time = new Date(message.createdAt);
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const date = time.getDate();
        const month = time.getMonth();
        return `${hours}:${minutes} ${ampm} - ${date}/${month}`;
    }, [message.createdAt]);

    // Event Handlers
    const toggleTime = () => {
        setHideTime((prev) => !prev);
    }

    return (
        <div className={`chat ${position}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS chat bubble component"
                        src={isSender ? authUser.profilePicture : oppositeUser.profilePicture}
                    />
                </div>
            </div>
            <div
                className='chat-bubble'
                onClick={toggleTime}
            >
                {message.message}
            </div>
            <div className={`chat-footer opacity-50 ${hideTime ? 'hidden' : ''}`}>
                <time className="text-xs">{createAtMemo}</time>
            </div>
        </div>
    )
}

export default Message