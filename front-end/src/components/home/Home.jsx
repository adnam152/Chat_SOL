import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import MessageContainer from '../../components/message/MessageContainer';
import NoChatSelected from '../../components/message/NoChatSelected';
import { useHomeContext } from '../../context/HomeContext';

function HomeComponent() {
    const { selectedChat } = useHomeContext();
    return (
        <div className="bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 h-4/5 min-h-96 flex gap-5 overflow-hidden">
            <Sidebar />
            <div className='w-128 border-l border-gray-500 pb-4'>
                {selectedChat ? <MessageContainer selectedChat={selectedChat} /> : <NoChatSelected />}
            </div>
        </div>
    )
}

export default HomeComponent