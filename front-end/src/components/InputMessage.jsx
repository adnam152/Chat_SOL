/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import messageService from "../services/messageService";
import { useChatGroupStore } from "../store/useChatGroupStore";

function InputMessage() {
    const [message, setMessage] = useState('');
    const [isSendding, setIsSendding] = useState(false);
    const { sendMessage } = messageService();
    const selectedChat = useChatGroupStore(state => state.selectedChat);

    useEffect(()=>{
        setMessage('')
    },[selectedChat]);

    const onsubmit = async (e) => {
        e.preventDefault();
        if (message.trim() === '' || isSendding) return;

        // Call API to send message
        setIsSendding(true);
        try {
            const res = await sendMessage(selectedChat._id, message);
            if (!res?.data) throw new Error(res.message);
            setMessage('');
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsSendding(false);
        }
    }

    return (
        <form className="flex gap-2 items-center" onSubmit={onsubmit}>
            <input
                type="text" className="input input-sm input-bordered w-full text-black"
                value={message} onChange={e => setMessage(e.target.value)}
            />
            <button type="submit" className="btn btn-sm btn-primary">
                {isSendding ? <span className="loading loading-sm" /> : (<><i className="fa-solid fa-paper-plane"></i> <span>Send</span></>)}
            </button>
        </form>
    )
}

export default InputMessage