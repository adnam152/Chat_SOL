import React, { useEffect, useState } from 'react';
import { RiSendPlaneLine } from 'react-icons/ri';
import messageAPI from '../API/message';
import Message from './Message';
import { LoaderIcon } from 'react-hot-toast';
import { useSocketContext } from '../contextProvider/useSocketContext';

function ChatSelected({ selectedConversation }) {
    const oppositeUser = selectedConversation.conversation.oppositeUser;
    const { getMessages, sendMessage } = messageAPI();
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [messages, setMessages] = useState([]);
    const {socket} = useSocketContext();

    // Get Message
    useEffect(() => {
        async function getMessageData() {
            try {
                const res = await getMessages(oppositeUser._id);
                if (res) {
                    setMessages(res);
                }
            } catch (error) {
                console.log(error.response.data.message || 'Failed to get messages');
            }
        };
        getMessageData();
    }, []);

    // Event Handlers
    const onInputChange = (e) => {
        setInput(e.target.value);
    }
    const onSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;
        setIsSending(true);
        try {
            const res = await sendMessage(oppositeUser._id, input);
            if (res) {
                setMessages((prevMess) => [res, ...prevMess]);
                setInput('');
            }
        } catch (error) {
            console.log(error.response.data.message || 'Failed to send message');
        }
        finally {
            setIsSending(false);
        }
    }

    // Socket
    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (data) => {
                if(data.conversation_id === selectedConversation.conversation._id){
                    setMessages((prevMess) => [data.lastMessage, ...prevMess]);
                }
            })
        }
        return () => {
            if (socket) {
                socket.off('newMessage');
            }
        }
    }, []);

    return (
        <div className='h-full flex flex-col'>
            <div className="bg-gray-700 px-4 py-2 flex-initial">
                <span>To: </span>
                <span className="font-bold text-indigo-300">{oppositeUser.fullname}</span>
            </div>

            {/* MESSAGE */}
            <div className='flex-1 h-full flex flex-col-reverse gap-2 p-4 overflow-y-auto custom-scrollbar'>
                {messages.map(message => {
                    return (
                        <Message
                            key={message._id}
                            message={message}
                            oppositeUser={oppositeUser}
                        />
                    )
                })}
            </div>

            {/* Message input */}
            <form action=""
                onSubmit={isSending ? (e) => e.preventDefault() : onSendMessage}
            >
                <label className="input border-white flex items-center gap-2 mx-4 h-10 bg-neutral focus-within:outline-none focus-within:border-indigo-400">
                    <input type="text" className="grow" placeholder="Send a message"
                        value={input}
                        onChange={onInputChange}
                    />
                    <button type="submit">
                        {isSending ? <LoaderIcon /> : <RiSendPlaneLine />}
                    </button>
                </label>
            </form>
        </div>
    )
}

export default ChatSelected