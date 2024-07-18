import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CiLogout } from "react-icons/ci";
import authAPI from '../../API/auth';
import conversationAPI from '../../API/conversation';
import { useAuthContext } from '../../contextProvider/useAuthContext';
import toast from 'react-hot-toast';
import Conversation from '../../components/Conversation';
import Search from '../../components/Search';
import NoChatSelected from '../../components/NoChatSelected';
import ChatSelected from '../../components/ChatSelected';

export default function HomePage() {
    const { logout } = authAPI();
    const { getConversation, searchConversation, setReadLastMessage } = conversationAPI();
    const { setAuthUser } = useAuthContext();

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

    // Change selectedconversation
    useEffect(() => {
        // Change Bg
        selectedConversation?.targetElement?.classList.add('bg-sky-600');

        // Set isRead
        if (selectedConversation 
            && !selectedConversation?.conversation.isRead 
            && selectedConversation?.conversation.lastMessage.senderId === selectedConversation?.conversation.oppositeUser._id
        ){
            setReadLastMessage(selectedConversation.conversation._id)
                .then(res => {
                    console.log(res);
                })
                .catch(error => {
                    console.log(error);
                });
        }

    }, [selectedConversation]);
    // Delete selectedconversation when conversations change
    useEffect(() => {
        setSelectedConversation((cvs) => {
            method_SetSelectedConversation(cvs);
            return null;
        });
    }, [conversations])

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
    const onSelectConversation = useCallback((conversation, e) => {
        setSelectedConversation((cvs) => {
            method_SetSelectedConversation(cvs);
            return {
                targetElement: e.target.classList.contains('select-conversation') ? e.target : e.target.closest('.select-conversation'),
                conversation
            }
        });
    }, []);
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
                        return <Conversation
                            key={conversation._id}
                            conversation={conversation}
                            onSelectConversation={onSelectConversation}
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
