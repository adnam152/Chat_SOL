/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import chatService from "../services/chatService";
import { toast } from "react-toastify";
import { useChatGroupStore } from "../store/useChatGroupStore";
import { useLoaderStore } from "../store/useLoaderStore";
import { useAuthStore } from "../store/useAuthStore";

function Menu() {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const selectedChat = useChatGroupStore(state => state.selectedChat);
    const { leaveChatGroup, deleteChatGroup } = chatService();
    const setLoading = useLoaderStore(state => state.setLoading);
    const deleteChatStore = useChatGroupStore(state => state.deleteChat);
    const setSelectedChat = useChatGroupStore(state => state.setSelectedChat);
    const authUser = useAuthStore(state => state.authUser);
    const isOwner = selectedChat?.ownerId === authUser._id;

    const firstCickBet = useRef(true);

    useEffect(() => {
        setIsOpenMenu(false);
        firstCickBet.current = true;
    }, [selectedChat]);

    const onToggleMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    }

    const onDelChat = async () => {
        if (!confirm('Are you sure to delete this chat?')) return;
        setLoading(true);
        try {
            const res = await deleteChatGroup(selectedChat._id);
            if (!res?.data) throw new Error(res.message);
            toast.success(res.message);
            deleteChatStore(res.data._id);
            setSelectedChat(null);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }

    }

    const onLeaveChat = async () => {
        if (!confirm('Are you sure to leave this chat?')) return;
        setLoading(true);
        try {
            const res = await leaveChatGroup(selectedChat._id);
            if (!res?.data) throw new Error(res.message);
            toast.success(res.message);
            deleteChatStore(res.data._id);
            setSelectedChat(null);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`h-full bg-gray-300 text-black w-80 border rounded-ss rounded-es absolute transition-all ${isOpenMenu ? 'right-0' : '-right-80'} `}>
            {/* Open menu btn */}
            <button
                className={`btn btn-sm rounded transition-all absolute ${isOpenMenu ? 'left-0' : '-left-10'} top-0`}
                onClick={onToggleMenu}
            >
                <i className={`fa-solid fa-angle-${isOpenMenu ? 'right' : 'left'}`}></i>
            </button>

            <div className="flex flex-col gap-2 h-full p-2">
                {/* Image - Invite ID */}
                <div className="grow flex flex-col items-center py-4 overflow-y-auto">
                    <img src="https://res.cloudinary.com/dzkdgm4c7/image/upload/v1731945251/DATN/rxkmkxsqet6xrc2sllry.jpg" className="w-20 rounded-full" />
                    <p className="font-bold">{selectedChat.chatName}</p>
                    <p className="text-xs">Invite ID: <span className="font-semibold text-sm">
                        {isOwner ? selectedChat._id : selectedChat._id.slice(0, 5) + '***************'}
                    </span></p>

                    <div className="divider m-0 mb-1" />

                    {/* Infor */}
                    <div className="space-y-2 w-full h-full  overflow-y-auto custom-scrollbar">
                        <MemberList key={'member' + selectedChat._id} isOwner={isOwner} />
                        {/* <BetList key={'bet' + selectedChat._id} onFirstClick={onFirstClick} bets={bets} /> */}
                    </div>
                </div>
                {/* Action */}
                {isOwner ?
                    (<button className="btn btn-sm btn-error text-white" onClick={onDelChat}>
                        <i className="fa-solid fa-trash"></i> Delete chat
                    </button>) :
                    (<button className="btn btn-sm" onClick={onLeaveChat}>
                        <i className="fa-solid fa-right-from-bracket"></i> Leave chat
                    </button>)
                }
            </div>
        </div>
    )
}

function MemberList({ isOwner }) {
    const [members, setMembers] = useState([]);
    const selectedChat = useChatGroupStore(state => state.selectedChat);
    const firstCick = useRef(true);
    const { getMembers } = chatService();
    const authUser = useAuthStore(state => state.authUser);
    const { removeMember } = chatService();
    const setLoading = useLoaderStore(state => state.setLoading);

    useEffect(() => {
        if (!selectedChat) return;
    }, [selectedChat])

    const onFirstClick = async () => {
        if (!firstCick.current) return;
        firstCick.current = false;
        // Call API to get members
        try {
            const res = await getMembers(selectedChat._id);
            if (!res?.data) throw new Error(res.message);
            setMembers(res.data);
        } catch (error) {
            console.error(error.message);
        }

    }

    const onRemoveMember = async (memberId) => {
        if (!confirm('Are you sure to remove this member?')) return;
        try {
            setLoading(true);
            const res = await removeMember(selectedChat._id, memberId);
            if (!res?.data) throw new Error(res.message);
            setMembers(prev => prev.filter(member => member._id !== memberId));
            toast.success(res.message);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="collapse border bg-base-300 border-neutral-500 rounded">
            <input type="checkbox" className="min-h-max" onChange={onFirstClick} />
            <div className="collapse-title text-sm font-medium min-h-max p-2">
                <span>Member list</span> <i className="fa-solid fa-caret-right"></i>
            </div>
            <div className="collapse-content px-2 space-y-2">

                {/* Member item */}
                {members.map((member, index) => {
                    return (
                        <div key={index} className="flex items-center gap-2 p-1.5 rounded-md border border-neutral-300 hover:bg-neutral-300">
                            <img src={member.avatar} className="h-8 w-8 rounded-full" />
                            <p className="text-sm grow">{member.fullname}</p>
                            {isOwner && member._id !== authUser._id &&
                                (<button className="btn btn-xs bg-transparent border-0 hover:bg-base-300" onClick={() => onRemoveMember(member._id)}>
                                    <i className="fa-solid fa-trash text-red-500"></i>
                                </button>)
                            }
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default Menu