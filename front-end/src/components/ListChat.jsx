import { useEffect } from "react";
import chatService from "../services/chatService"
import { toast } from "react-toastify";
import { useChatGroupStore } from "../store/useChatGroupStore";

function ListChat() {
    const { getChatGroups } = chatService();
    const listChats = useChatGroupStore(state => state.listChats);
    const setChats = useChatGroupStore(state => state.setChats);
    const selectedChat = useChatGroupStore(state => state.selectedChat);
    const setSelectedChat = useChatGroupStore(state => state.setSelectedChat);

    useEffect(() => {
        (async () => {
            try {
                const res = await getChatGroups();
                if (!res?.data) throw new Error(res.message);
                setChats(res.data);
            } catch (error) {
                toast.error(error?.message || 'Get chat groups failed');
            }
        })();
    }, [])


    return (
        <div className='mt-12 w-56 flex-1 overflow-y-auto custom-scrollbar border-b border-info'>
            <h3 className='text-lg font-semibold'>Chat Groups</h3>
            
            <div className="h-0.5 w-full bg-neutral-300 my-4"></div>

            <ul className="menu rounded-box p-0 gap-2">
                {listChats.map((chat, index) => {
                    return (
                        <li key={`chat-${selectedChat?._id || ''}${index}`}
                            className={`${selectedChat?._id === chat._id ? 'bg-sky-700' : 'bg-neutral-600 border border-slate-500'} rounded p-2 ps-3 cursor-pointer hover:bg-neutral active:scale-95 transition`}
                            onClick={() => setSelectedChat(chat)}
                        >{chat.chatName}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ListChat