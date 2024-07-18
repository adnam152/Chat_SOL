import React, { useEffect, useState } from 'react';
import { CiLogout } from "react-icons/ci";
import authAPI from '../../API/auth';
import conversationAPI from '../../API/conversation';
import { useAuthContext } from '../../contextProvider/useAuthContext';
import { useSocketContext } from '../../contextProvider/useSocketContext';
import toast from 'react-hot-toast';
import Conversation from '../../components/Conversation';
import Search from '../../components/Search';
import NoChatSelected from '../../components/NoChatSelected';
import ChatSelected from '../../components/ChatSelected';

export default function HomePage() {
    const { logout } = authAPI();
    const { getConversation, searchConversation, setReadLastMessage } = conversationAPI();
    const { setAuthUser } = useAuthContext();
    const { socket, onlineUsers } = useSocketContext();

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isSearched, setIsSearched] = useState(false);

    // -- Get data
    const getConversationData = async () => {
        console.log('Get conversation data');
        try {
            const data = await getConversation();
            if (data.conversations) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getConversationData();
    }, []);

    // Change selectedconversation - Set isRead
    useEffect(() => {
        if (selectedConversation
            && !selectedConversation?.conversation.isRead
            && selectedConversation?.conversation.lastMessage.senderId === selectedConversation?.conversation.oppositeUser._id
        ) {
            setReadLastMessage(selectedConversation.conversation._id)
                .then(() => {
                    setConversations((prevConversations) => {
                        const newConversations = [...prevConversations];
                        const index = newConversations.findIndex(cvs => cvs._id === selectedConversation.conversation._id);
                        if (index !== -1) {
                            newConversations[index].isRead = true;
                        }
                        return newConversations;
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [selectedConversation]);

    // Event Handlers
    const onLogout = async () => {
        try {
            await logout();
            setAuthUser(null);
            toast.success('Logout successfully');

        } catch (error) {
            toast.error(error.response.data.message || 'Logout failed');
        }
    }
    const onSelectConversation = (conversation, e) => {
        setSelectedConversation((cvs) => {
            method_SetSelectedConversation(cvs);
            return {
                targetElement: e.target.classList.contains('select-conversation') ? e.target : e.target.closest('.select-conversation'),
                conversation
            }
        });
    };
    const onSubmitForm = async (input, e) => {
        e.preventDefault();
        try {
            const res = await searchConversation(input);
            if (res.conversation) {
                setConversations([res.conversation]);
                setIsSearched(true);
            }
            else {
                toast.error('No conversation found');
            }
        } catch (error) {
            console.log(error.response.data.message || 'Search failed');
        }
    }
    const onCancleSearch = () => {
        if (isSearched) {
            getConversationData();
            setIsSearched(false);
        }
    }

    // Socket get new message
    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (data) => {
                // Noti new message
                setConversations((prevConversations) => {
                    const newConversations = [...prevConversations];
                    const index = newConversations.findIndex(cvs => cvs._id === data.conversation_id);
                    if (index !== -1) {
                        newConversations[index].lastMessage = data.lastMessage;
                        newConversations[index].isRead = false;
                    }
                    return newConversations;
                })
            })
        }
        return () => {
            if (socket) {
                socket.off('newMessage');
            }
        }
    }, [socket])

    // Method
    const method_SetSelectedConversation = (prevConversation) => {
        if (prevConversation) {
            prevConversation.targetElement?.classList.remove('bg-sky-600');
        }
    }

    return (
        <div className="bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 h-4/5 min-h-96 flex gap-5 overflow-hidden">
            {/* SideBar */}
            <div className="h-full flex flex-col py-4 ps-4">
                <Search onSubmitForm={onSubmitForm} onCancleSearch={onCancleSearch} />

                <div className='mt-2 flex-1 overflow-y-auto custom-scrollbar pe-3 border-b border-info'>
                    {conversations.map(conversation => {
                        const isOnline = onlineUsers.includes(conversation.oppositeUser._id);
                        return <Conversation
                            key={`${conversation.lastMessage?._id || conversation._id}`}
                            conversation={conversation}
                            onSelectConversation={onSelectConversation}
                            isOnline={isOnline}
                            isSelected={selectedConversation?.conversation?._id === conversation._id}
                        />
                    })}
                </div>

                <div
                    className='mt-3 flex items-center hover:underline hover:text-info cursor-pointer w-max select-none'
                    onClick={onLogout}>
                    <CiLogout /><span className='ms-1'>Logout</span>
                </div>
            </div>

            {/* Chat Container */}
            <div className='w-128 border-l border-gray-500 pb-4'>
                {selectedConversation ?
                    <ChatSelected
                        selectedConversation={selectedConversation}
                        key={selectedConversation.conversation._id}
                    /> : <NoChatSelected />
                }
            </div>
        </div>
    )
}
