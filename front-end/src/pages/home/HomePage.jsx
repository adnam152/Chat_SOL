/* eslint-disable react/prop-types */
import NoChatSelected from '../../components/NoChatSelected';

import ListChat from "../../components/ListChat";
import GroupNav from "../../components/GroupNav";
import { useChatGroupStore } from "../../store/useChatGroupStore";
import ChatSelected from "../../components/ChatSelected";


export default function HomePage() {
    const selectedChat = useChatGroupStore(state => state.selectedChat);
    
    return (
        <div className="bg-gray-300 p-4 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 h-4/5 min-h-96 flex gap-5 overflow-hidden">
            {/* SideBar */}
            <div className="h-full flex flex-col pe-2 border-r border-gray-400 relative overflow-x-hidden">

                <GroupNav />

                {/* List Group chat */}
                <ListChat />
            </div>

            {/* Chat Container */}
            <div className='w-128'>
                {!selectedChat ? <NoChatSelected /> : <ChatSelected />}
            </div>
        </div>
    )
}