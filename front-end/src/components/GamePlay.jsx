/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore"
import { useAuthStore } from "../store/useAuthStore";
import { bet, getResult } from "../services/gameService";
import { toast } from "react-toastify";
import { createGame } from "../services/gameService";

function GamePlay() {
    const authUser = useAuthStore(state => state.authUser);
    const setAuthUser = useAuthStore(state => state.setAuthUser);
    const game = useGameStore(state => state.game);
    const [selected, setSelected] = useState({});
    const [isBetted, setIsBetted] = useState(false);
    const [result, setResult] = useState(null);
    const [countDown, setCountDown] = useState(game?.endAt - Date.now() - 100);
    const gameInterval = useRef(null);
    const [isShowGift, setIsShowGift] = useState(true);
    const resetGameStore = useGameStore(state => state.resetGameStore);
    const setGame = useGameStore(state => state.setGame);

    // Count down
    useEffect(() => {
        if (game) {
            gameInterval.current = setInterval(() => {
                setCountDown(prev => prev - 1000);
            }, 1000);
        }
        return () => {
            clearInterval(gameInterval.current);
        }
    }, [game]);

    // GET RESULT WHEN COUNTDOWN <= 0, RESET GOLD IF NOT CLICK BET
    useEffect(() => {
        if (countDown <= 0) {
            clearInterval(gameInterval.current);
            if (!isBetted) {
                setAuthUser({ ...authUser, gold: authUser.gold + Object.values(selected).reduce((a, b) => a + b, 0) * game.stakeAmount });
                setSelected({});
            }
            (async () => {
                try {
                    const res = await getResult(game._id);
                    if (!res?.data) throw new Error(res.message);
                    setResult(res.data);
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }, [countDown]);

    // Set timeout to hide gift
    useEffect(() => {
        if (result) {
            setTimeout(() => {
                setIsShowGift(false);
                console.log('timeout')
            }, 3000);
        }
    }, [result])

    // Calc gold for User
    useEffect(() => {
        if (result && isBetted) {
            setTimeout(() => {
                // Nếu chọn đúng thì newgold = gold + số tiền đã cược đúng * 2
                const win = result.reduce((a, b) => a + (selected[b] || 0), 0);
                if (win === 0) return toast.error('You lose 😣');
                const winGold = win * game.stakeAmount * 2;
                toast.success(`You win ${winGold} gold 🎉`);
                const newGold = authUser.gold + winGold;
                setAuthUser({ ...authUser, gold: newGold });
            }, 3000);
        }
    }, [result]);

    // Event
    const onReset = () => {
        if (isBetted) return toast.error('You have already betted');
        const tempAuthUser = { ...authUser, gold: authUser.gold + Object.values(selected).reduce((a, b) => a + b, 0) * game.stakeAmount };
        setAuthUser(tempAuthUser);
        setSelected({});
    }

    const onSelect = (i) => {
        if (isBetted) return toast.error('You have already betted');
        if (authUser.gold < game.stakeAmount) return toast.error('Not enough gold');
        setAuthUser({ ...authUser, gold: authUser.gold - game.stakeAmount });
        setSelected(prev => {
            return {
                ...prev,
                [i]: (prev[i] || 0) + 1
            }
        })
    }

    const onBet = async () => {
        if (game.endAt - Date.now() <= 0) return toast.error('Game ended');
        if (isBetted) return toast.error('You have already betted');
        if (authUser.gold < game.stakeAmount) return toast.error('Not enough gold');
        try {
            const res = await bet(game._id, selected);
            if (!res?.data) throw new Error(res.message);
            setIsBetted(true);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const onPlayAgain = async () => {
        if(isShowGift) return toast.error('Please wait for the result');
        try {
            const res = await createGame(game.chatId, game.stakeAmount);
            if (!res?.data) throw new Error(res.message);
            setGame(res.data);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const onClose = () => {
        resetGameStore();
    }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center z-50 bg-black bg-opacity-60 gap-5">
            {/* List */}
            {countDown > 0 ? (<div className="grid grid-cols-3 w-full max-w-4xl">
                {Array.from({ length: 6 }).map((_, index) => {
                    return (
                        <Image key={`image_${index}`} i={index + 1} onSelect={onSelect} selected={selected} />
                    )
                })}
            </div>) : (isShowGift ?
                (<img src="/roll.gif" alt="" className="max-w-4xl big-img rounded" />) :
                (<ResultImg result={result} selected={selected} />)
            )}

            {/* Count down */}
            <div className="flex flex-col gap-10 items-center">
                <div className="text-xl w-44 text-center">
                    <div className="font-semibold">GOLD: {authUser?.gold.toLocaleString()}</div>
                    <div className="text-lg">AMOUNT: {game?.stakeAmount.toLocaleString()}</div>
                </div>
                <CountDown countDown={countDown} />

                {countDown > 0 ?
                    <>
                        {/* Reset btn */}
                        <button
                            className={`${isBetted ? 'btn-neutral' : 'btn-error hover:-translate-y-1 transition-all cursor-pointer active:scale-95'} btn w-36 h-36 font-serif font-semibold rounded-full flex justify-center items-center text-4xl select-none`}
                            onClick={onBet}
                        >BET</button>
                        {/* Bet btn */}
                        <div
                            className="w-36 h-36 font-serif bg-neutral-400 text-black font-semibold rounded-full flex justify-center items-center text-2xl hover:-translate-y-1 transition-all cursor-pointer select-none active:scale-95"
                            onClick={onReset}
                        >RESET</div>
                    </> :
                    <>
                        {authUser._id === game.creatorId && (<button
                            className={`${isShowGift ? 'btn-neutral' : 'btn-error hover:-translate-y-1 transition-all cursor-pointer active:scale-95'} btn w-36 h-36 font-serif font-semibold rounded-full flex justify-center items-center text-3xl select-none`}
                            onClick={onPlayAgain}
                        >AGAIN</button>)}
                        <div
                            className="w-36 h-36 font-serif bg-neutral-400 text-black font-semibold rounded-full flex justify-center items-center text-4xl hover:-translate-y-1 transition-all cursor-pointer select-none active:scale-95"
                            onClick={onClose}
                        >Close</div>
                    </>
                }
            </div>
        </div >
    )
}

function CountDown({ countDown }) {
    let second = Math.floor(countDown / 1000) % 60;
    if (second < 0) second = 0;

    return (
        <div className="text-7xl">{second}</div>
    )
}

function Image({ i, onSelect, selected }) {
    const num = selected[i];

    return (
        <div className="relative">
            <img src={`/${i}.png`} alt="" className="border border-neutral cursor-pointer active:scale-95 transition-transform" onClick={() => onSelect(i)} />
            {num && (<span className="text-7xl absolute z-30 top-2 right-2 text-error font-serif">{num}</span>)}
        </div>
    )
}

function ResultImg({ result, selected }) {

    return result.map((r, index) => {
        return (
            <div className="relative" key={index} >
                <img src={`/${r}.png`} alt="" className="max-w-72 w-full rounded big-img" />
                <span className="text-7xl absolute z-30 top-2 right-2 text-error font-serif">{selected[r] || 0}</span>
            </div>
        )
    })
}

export default GamePlay