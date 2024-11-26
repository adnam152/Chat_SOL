/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import InputMessage from "./InputMessage";
import { useChatGroupStore } from "../store/useChatGroupStore";
import messageService from "../services/messageService";
import { useLoaderStore } from "../store/useLoaderStore";
import { useAuthStore } from "../store/useAuthStore";
import Menu from "./Menu";
import { useSocketStore } from "../store/useSocketStore";
import { useModalStore } from "../store/useModalStore";
import { useGameStore } from "../store/useGameStore";
import { createGame, getGame } from "../services/gameService";

function ChatSelected() {
    const selectedChat = useChatGroupStore(state => state.selectedChat);
    const [messages, setMessages] = useState([]);
    const { getMessages } = messageService();
    const setLoading = useLoaderStore(state => state.setLoading);
    const socket = useSocketStore(state => state.socket);
    const authUser = useAuthStore(state => state.authUser);
    const isOwner = selectedChat?.ownerId === authUser._id;
    const openModal = useModalStore(state => state.openModal);
    const game = useGameStore(state => state.game);
    const setGame = useGameStore(state => state.setGame);
    const resetGameStore = useGameStore(state => state.resetGameStore);
    const setSelectedChat = useChatGroupStore(state => state.setSelectedChat);
    const listChats = useChatGroupStore(state => state.listChats);
    const setChats = useChatGroupStore(state => state.setChats);

    // get messages
    useEffect(() => {
        if (!selectedChat) return;
        (async () => {
            setLoading(true);
            try {
                const res = await getMessages(selectedChat._id);
                if (!res?.data) throw new Error(res.message);
                setMessages(res.data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [selectedChat]);

    // reset game store and get game, set count down
    useEffect(() => {
        resetGameStore();
        (async () => {
            try {
                const res = await getGame(selectedChat._id);
                if (!res?.data) throw new Error(res.message);
                setGame(res.data);
                const cd = res.data.endAt - Date.now();
                setCountDown(cd);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, [selectedChat]);

    // Event
    const createGame = () => {
        openModal(<SettingGame />)
    }

    // Socket
    useEffect(() => {
        if (!socket) return;
        // Listen new message
        socket.on("newMessage", (data) => {
            const { message, chatId } = data;
            if (chatId === selectedChat._id) {
                setMessages(prev => [message, ...prev]);
            }
        });
        // listen member
        socket.on("updateMember", (data) => {
            const { chat } = data;
            setChats(listChats.map(item => item._id === chat._id ? chat : item));
            if (chat._id === selectedChat._id) {
                setSelectedChat(chat);
            }
        });
        // list new game
        socket.on("newGame", (data) => {
            const { game } = data;
            if (game.chatId === selectedChat._id) {
                setGame(game);
            }
        });
        return () => {
            socket.off("newMessage");
        }
    }, [socket]);


    return (
        <div className="h-full flex flex-col gap-2 relative overflow-x-hidden">
            {/* title */}
            <div className="font-semibold grid grid-cols-3 gap-2 items-center">
                <div>
                    <p className="text-sky-500">{selectedChat?.chatName}</p>
                    <p className="font-normal text-sm flex gap-2 items-center">
                        <i className="fa-regular fa-user"></i> {selectedChat?.members?.length} members
                    </p>
                </div>

                {isOwner && !game && (
                    <button
                        className="btn btn-sm text-neutral font-bold"
                        onClick={createGame}
                    >CREATE GAME</button>
                )}
                {game && game.chatId === selectedChat._id && (
                    <JoinGame game={game} />
                )}
            </div>

            {/* messages */}
            <div className="grow border border-gray-500 p-2 rounded overflow-y-auto custom-scrollbar flex flex-col-reverse">
                {messages.map((message, index) => {
                    return (
                        <Message key={`message_${message._id}${index}`} message={message} selectedChat={selectedChat} />
                    )
                })}
            </div>

            {/* input */}
            <InputMessage />

            {/* Menu */}
            <Menu />
        </div>
    )
}

function JoinGame({ game }) {
    const setShowGame = useGameStore(state => state.setShowGame);
    const gameInterval = useRef(null);
    const [countDown, setCountDown] = useState(game.endAt - Date.now());
    const isShowGame = useGameStore(state => state.isShowGame);
    const resetGameStore = useGameStore(state => state.resetGameStore);

    const minute = Math.floor(countDown / 1000 / 60) % 60;
    const second = Math.floor(countDown / 1000) % 60;

    // Start count down
    useEffect(() => {
        if (countDown > 0) {
            gameInterval.current = setInterval(() => {
                setCountDown(prev => prev - 1000);
            }, 1000);
        }
        return () => {
            clearInterval(gameInterval.current);
        }
    }, [game])
    // Stop count down when count down <= 0 and reset game store
    useEffect(() => {
        if (countDown <= 0) {
            clearInterval(gameInterval.current);
            !isShowGame && resetGameStore();
        }
    }, [countDown])

    const joinGame = () => {
        setShowGame(true);
    }

    return (
        <div>
            <button
                className="btn btn-sm btn-error text-white font-bold animate-bounce"
                onClick={joinGame}
            >JOIN GAME
            </button>
            <span className="ms-3">{minute}:{second}</span>
        </div>
    )
}

function Message({ message, selectedChat }) {
    if (message.isNotification) return <p className="text-center text-xs font-light italic">
        <span className="font-semibold text-sky-300">{message.senderId.fullname}</span> {message.content || 'New bet have been created'}
    </p>;

    const authUser = useAuthStore(state => state.authUser);
    let charPosition = 'chat-start';
    let chatBubbleColor = '';
    if (message.senderId._id === authUser._id) {
        charPosition = 'chat-end';
        chatBubbleColor = 'chat-bubble-info';
    }
    const isOwner = selectedChat.ownerId === message.senderId._id;

    return (
        <div className={`chat ${charPosition}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img src={message.senderId.avatar} />
                </div>
                {isOwner && (<div className="absolute bg-neutral bottom-0 right-0 rounded-full w-5 h-5">
                    <i className="fa-solid fa-key text-orange-300 text-[12px] -translate-y-1 translate-x-1"></i>
                </div>)}
            </div>
            <div className={`chat-bubble ${chatBubbleColor} text-sm`}>{message.content}</div>
            <p className="text-xs w-max font-light italic mt-1 text-gray-300">{message.senderId.fullname}</p>
        </div>
    )
}

function SettingGame() {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState(1000);
    const ChatSelected = useChatGroupStore(state => state.selectedChat);
    const setGame = useGameStore(state => state.setGame);
    const closeModal = useModalStore(state => state.closeModal);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (input < 100) return alert('Minimum bet is 100');
        try {
            setIsLoading(true);
            const res = await createGame(ChatSelected._id, input);
            if (!res?.data) throw new Error(res.message);
            setGame(res.data);
            closeModal();

        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="mx-auto w-max" onSubmit={onSubmit}>
            <h3>Enter the minium bet</h3>
            <div className='flex items-center mt-2'>
                <input
                    type="number" placeholder="Group's ID" className="input input-bordered w-80 input-sm rounded-se-none rounded-ee-none"
                    value={input} onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className='btn btn-info btn-sm rounded-ss-none rounded-es-none'>
                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'START'}
                </button>
            </div>
        </form>
    )
}

export default ChatSelected