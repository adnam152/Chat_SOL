/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { useChatGroupStore } from "../store/useChatGroupStore";
import { useModalStore } from "../store/useModalStore";
import chatService from "../services/chatService";
import { useLoaderStore } from "../store/useLoaderStore";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { updateInfor } from '../services/authService';
import { createTransaction, getBalance, verifyTransaction } from "../services/solanaService";
import authService from "../services/authService";

import { Connection, Transaction } from "@solana/web3.js";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const RATE = '100,000';

function GroupNav() {
    const authUser = useAuthStore(state => state.authUser);
    const openModal = useModalStore(state => state.openModal);
    const [balance, setBalance] = useState(0);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const { logout } = authService();
    const setAuthUser = useAuthStore(state => state.setAuthUser);
    const setLoading = useLoaderStore(state => state.setLoading);
    // console.log(authUser);

    const onToggleMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    }
    // Event Handlers
    const onLogout = async () => {
        try {
            await logout();
            setAuthUser(null);
            toast.success('Logout successfully');
        } catch (error) {
            toast.error(error?.message || 'Logout failed');
        }
    }

    const onGetBalance = async () => {
        setLoading(true);
        try {
            const balanceGet = await getBalance();
            setBalance(balanceGet);
        } catch (error) {
            toast.error(error?.message || 'Get balance failed');
        } finally {
            setLoading(false);
        }
    }

    const onBuyGold = async () => {
        setLoading(true);
        await onGetBalance();
        setLoading(false);
        openModal(<BuyGoldElement balance={balance} />);
    }

    if (!authUser) return null;
    return (
        <div className={`max-w-full h-full py-4 flex flex-col bg-gray-300 text-black w-60 border rounded-ss rounded-es absolute z-10 transition-all ${isOpenMenu ? 'left-0' : 'left-[-14.5rem]'}`} >

            {/* Open menu btn */}
            <button
                className={`btn btn-sm btn-outline rounded transition-all absolute ${isOpenMenu ? 'right-2 text-black' : '-right-10 text-white'} top-0`}
                onClick={onToggleMenu}
            >
                <i className={`fa-solid fa-angle-${isOpenMenu ? 'left' : 'right'}`}></i>
            </button>

            {/* main */}
            <div className="flex flex-col items-center p-4 grow gap-2">
                <div className="flex flex-col items-center gap-1">
                    <img
                        role="button" src={authUser.avatar} className="w-16 rounded-full shadow shadow-white"
                        alt="avatar" onClick={() => openModal(<ChangeInforElement authUser={authUser} />)}
                    />
                    <p className="text-sm text-center mt-1 font-semibold">{authUser.fullname}</p>
                    {/* Balance */}
                    <p className="text-sm w-max max-auto mt-1 font-semibold flex gap-2">
                        <button className="btn btn-xs" onClick={onGetBalance}><i className="fa-solid fa-rotate"></i></button>
                        <span>SOL: {balance}</span>
                    </p>
                    <p className="text-sm w-max max-auto mt-1 font-semibold flex gap-2">
                        <span> Gold: {authUser?.gold?.toLocaleString()}</span>
                    </p>
                    {/* Transfer SOL to Gold */}
                    <p className="text-sm w-max max-auto mt-1 font-semibold flex gap-2">
                        <button className="btn btn-xs" onClick={onBuyGold}>
                            <i className="fa-solid fa-plus"></i>Buy Gold
                        </button>
                    </p>
                </div>

                <div className="divider my-0"></div>

                <button className='btn btn-sm w-full' onClick={() => openModal(<CreateElement setIsOpenMenu={setIsOpenMenu} />)}>+ Create</button>
                <button className='btn btn-sm w-full' onClick={() => openModal(<JoinElement setIsOpenMenu={setIsOpenMenu} />)}>Join</button>

            </div>

            {/* Logout */}
            <button
                className='btn rounded btn-sm btn-error flex items-center w-full text-white'
                onClick={onLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
            </button>
        </div>
    )
}

function BuyGoldElement({ balance }) {
    const [isLoading, setLoading] = useState(false);
    const [amountSOL, setAmountSOL] = useState('');
    const connection = new Connection("https://api.devnet.solana.com");
    const setAuthUser = useAuthStore(state => state.setAuthUser);
    const closeModal = useModalStore(state => state.closeModal);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!window.solana || !window.solana.isPhantom) {
            alert("Please connect Phantom Wallet");
            return;
        }

        try {
            setLoading(true);
            const wallet = window.solana;
            await wallet.connect(); // Kết nối ví Phantom
            const publicKey = wallet.publicKey;

            // Gửi yêu cầu tạo transaction lên server
            const payload = {
                amountSOL: parseFloat(amountSOL),
                senderPublicKey: publicKey.toString(),
            };
            const response = await createTransaction(payload);
            console.log("Transaction response:", response);

            const { transactionData, blockhash } = response;
            if (!transactionData || !blockhash) throw new Error("Failed to create transaction");

            // Tạo transaction từ dữ liệu server trả về
            const transaction = Transaction.from(Buffer.from(transactionData, "base64"));

            // Set blockhash
            transaction.recentBlockhash = blockhash;

            // Ký giao dịch bằng Phantom
            const signedTransaction = await wallet.signTransaction(transaction);

            // Gửi giao dịch đã ký lên blockchain
            const txId = await connection.sendRawTransaction(signedTransaction.serialize(), {
                skipPreflight: false,
            });

            // Xác nhận giao dịch trong thời gian hợp lệ
            const confirmResult = await connection.confirmTransaction(
                txId,
                "confirmed"
            );

            if (confirmResult.value.err) {
                throw new Error("Transaction confirmation failed");
            }

            // Gửi txId lên server để xác nhận
            const verifyResult = await verifyTransaction({ txId, blockhash });
            const user = verifyResult.user;
            if (user) {
                setAuthUser(user);
                toast.success("Transaction successful");
            }
        } catch (error) {
            console.error("Transaction error:", error);
        } finally {
            closeModal();
            setLoading(false);
        }
    };

    return (
        <form className="mx-auto w-max" onSubmit={onSubmit}>
            <h3 className="text-center font-bold text-xl">Buy Gold</h3>
            <p className="">You have <span className="font-bold">{balance} SOL</span></p>
            <p className="text-sm italic">1 SOL = {RATE} Gold</p>
            <div className='flex items-center mt-2'>
                <input
                    placeholder="Amount SOL" max={balance}
                    type="number" className="input input-bordered w-80 input-sm rounded-none"
                    value={amountSOL} onChange={(e) => setAmountSOL(e.target.value)}
                />
                <button type="submit" className={`btn btn-sm btn-primary rounded-es-none rounded-ss-none ${isLoading ? 'btn-disabled' : ''}`}>
                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'Buy'}
                </button>
            </div>
        </form>
    )
}

function ChangeInforElement({ authUser }) {
    const isLoading = useLoaderStore(state => state.isLoading);
    const setLoading = useLoaderStore(state => state.setLoading);
    const [infor, setInfor] = useState({ fullname: authUser.fullname, avatar: authUser.avatar });
    const setAuthUser = useAuthStore(state => state.setAuthUser);
    const closeModal = useModalStore(state => state.closeModal);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!infor.fullname || isLoading) return;

        // Call API to update user's information
        try {
            setLoading(true);
            const res = await updateInfor(infor);
            if (!res?.data) throw new Error('Update information failed');
            toast.success('Update information successfully');
            setAuthUser(res.data);
            closeModal();

        } catch (error) {
            toast.error(error?.message || 'Update information failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="mx-auto w-max" onSubmit={onSubmit}>
            <h3 className="text-center font-bold text-xl">Change Information</h3>
            <div className='flex items-center mt-2'>
                <button type="button" className='btn btn-sm rounded-se-none rounded-ee-none grow'>Avatar Url</button>
                <input
                    type="text" placeholder="" className="input input-bordered w-80 input-sm rounded-es-none rounded-ss-none"
                    value={infor.avatar} onChange={(e) => setInfor({ ...infor, avatar: e.target.value })}
                />
            </div>
            <div className='flex items-center mt-2'>
                <button type="button" className='btn btn-sm rounded-se-none rounded-ee-none grow'>Full name</button>
                <input
                    type="text" placeholder="" className="input input-bordered w-80 input-sm rounded-es-none rounded-ss-none"
                    value={infor.fullname} onChange={(e) => setInfor({ ...infor, fullname: e.target.value })}
                />
            </div>
            <button type="submit" className='btn btn-primary btn-sm mt-2 w-full text-white'>
                {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'Update'}
            </button>
        </form>
    )
}

function JoinElement({setIsOpenMenu}) {
    const [input, setAmountSOL] = useState('');
    const isLoading = useLoaderStore(state => state.isLoading);
    const setLoading = useLoaderStore(state => state.setLoading);
    const { joinChatGroup } = chatService();
    const insertChat = useChatGroupStore(state => state.insertChat);
    const setSelectedChat = useChatGroupStore(state => state.setSelectedChat);
    const closeModal = useModalStore(state => state.closeModal);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!input || isLoading) return;

        setLoading(true);
        try {
            const res = await joinChatGroup(input);
            if (!res?.data) throw new Error('Join group failed');
            toast.success('Join group successfully');
            insertChat(res.data);
            setSelectedChat(res.data);
            closeModal();
            setIsOpenMenu(false);
        } catch (error) {
            toast.error(error?.message || 'Join group failed');
        } finally {
            setLoading(false);
        }

    }

    return (
        <form className="mx-auto w-max" onSubmit={onSubmit}>
            <h3>Enter group ID to join</h3>
            <div className='flex items-center gap-4 mt-2'>
                <input
                    type="text" placeholder="Group's ID" className="input input-bordered w-80 input-sm"
                    value={input} onChange={(e) => setAmountSOL(e.target.value)}
                />
                <button type="submit" className='btn btn-info btn-sm'>
                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'Join'}
                </button>
            </div>
        </form>
    )
}

function CreateElement({setIsOpenMenu}) {
    const [input, setAmountSOL] = useState('');
    const isLoading = useLoaderStore(state => state.isLoading);
    const setLoading = useLoaderStore(state => state.setLoading);
    const { createChatGroup } = chatService();
    const closeModal = useModalStore(state => state.closeModal);
    const insertChat = useChatGroupStore(state => state.insertChat);
    const setSelectedChat = useChatGroupStore(state => state.setSelectedChat);

    const onsubmit = async (e) => {
        e.preventDefault();
        if (!input || isLoading) return;

        setLoading(true);
        try {
            const res = await createChatGroup(input);
            if (!res?.data) throw new Error('Create group failed');
            toast.success('Create group successfully');
            insertChat(res.data);
            setSelectedChat(res.data);
            closeModal();
            setIsOpenMenu(false);
        } catch (error) {
            toast.error(error?.message || 'Create group failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="mx-auto w-max" onSubmit={onsubmit}>
            <h3>Create a new group</h3>
            <div className='flex items-center gap-4 mt-2'>
                <input
                    type="text" placeholder="Group's name" className="input input-bordered w-80 input-sm"
                    value={input} onChange={(e) => setAmountSOL(e.target.value)}
                />
                <button type="submit" className='btn btn-info btn-sm'>
                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'Create'}
                </button>
            </div>
        </form>
    )
}

export default GroupNav