import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RiSendPlaneLine } from "react-icons/ri";
import toast from 'react-hot-toast';

import Message from './Message';
import useMessage from '../../hooks/useMessage';
import { useAuthContext } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SoketContext';

function MessageContainer({ selectedChat }) {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chattingUser, setChattingUser] = useState({});
    const { getMessages, sendMessage } = useMessage();
    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();

    console.log("Re-render MessageContainer");

    // Get Messages
    useEffect(() => {
        // Get receiver user
        const chattingUser = selectedChat.members.find((member) => member._id !== authUser._id);
        setChattingUser(chattingUser);

        // Reset input message
        setInputMessage('');

        // Get messages
        async function fetchMessages() {
            return await getMessages({ receiverId: chattingUser._id, setMessages });
        }
        fetchMessages()
            .then(res => {
                if (!res) {
                    toast.error('Failed to fetch messages. Login again');
                    setMessages([]);
                }
            })
    }, [selectedChat])

    // Socket Event
    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (message) => {
                console.log('New Message: ', message);
                setMessages((prevMessages) => [message, ...prevMessages]);
            })
        }
        return () => {
            if (socket) {
                socket.off('newMessage');
            }
        }
    }, [socket, chattingUser])

    // Send message Event Handler
    const sendMessageEvent = useCallback((e) => {
        e.preventDefault();
        if(inputMessage.trim() === '') return;
        sendMessage({ receiverId: chattingUser._id, message: inputMessage, setMessages })
            .then(res => {
                if (res) {
                    setInputMessage('');
                }
                else {
                    toast.error('Failed to send message');
                }
            })
    })

    // Input Message Change Handler
    const inputMessageChange = useCallback((e) => {
        setInputMessage(e.target.value);
    })

    // UseMemo for Message Component
    const memoMessages = useMemo(()=>{
        return messages.map((message) => {
            return <Message key={message._id} message={message} chattingUser={chattingUser} />
        })
    },[messages])

    return (
        <div className='h-full flex flex-col'>
            <div className="bg-gray-700 px-4 py-2 flex-initial">
                <span>To: </span>
                <span className="font-bold text-indigo-300">{chattingUser.fullname}</span>
            </div>

            {/* MESSAGE */}
            <div className='flex-1 h-full flex flex-col-reverse gap-2 p-4 overflow-y-auto custom-scrollbar'>
                {memoMessages}
            </div>

            {/* Message input */}
            <form action="" onSubmit={sendMessageEvent}>
                <label className="input border-white flex items-center gap-2 mx-4 h-10 bg-neutral focus-within:outline-none focus-within:border-indigo-400">
                    <input type="text" className="grow" placeholder="Send a message"
                        value={inputMessage} onChange={inputMessageChange}
                    />
                    <button type="submit"><RiSendPlaneLine /></button>
                </label>
            </form>
        </div>
    )
}

export default MessageContainer