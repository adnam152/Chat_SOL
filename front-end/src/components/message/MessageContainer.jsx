import React from 'react';
import { RiSendPlaneLine } from "react-icons/ri";
import Message from './Message';

function MessageContainer() {
    const sendProps = {
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati veritatis laborum consectetur nesciunt eum dolores tempora. Quod optio laborum, ratione asperiores, unde nostrum totam nesciunt quisquam saepe sequi impedit explicabo!",
        isSender: true
    }
    const receiveProps = {
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati veritatis laborum consectetur nesciunt eum dolores tempora. Quod optio laborum, ratione asperiores, unde nostrum totam nesciunt quisquam saepe sequi impedit explicabo!",
        isSender: false
    }
    return (
        <div className='h-full flex flex-col'>
            <div className="bg-gray-700 px-4 py-2 flex-initial">
                <span>To: </span>
                <span className="font-bold text-indigo-300">John Doe</span>
            </div>

            {/* MESSAGE */}
            <div className='flex-1 h-full flex flex-col-reverse gap-2 p-4 overflow-y-auto custom-scrollbar'>
                <Message {...sendProps} />
                <Message {...receiveProps} />
                <Message {...receiveProps} />

                <Message {...sendProps} text="Hello" />
            </div>

            <label className="input border-white flex items-center gap-2 mx-4 h-10 bg-neutral focus-within:outline-none focus-within:border-indigo-400">
                <input type="text" className="grow" placeholder="Send a message" />
                <RiSendPlaneLine />
            </label>
        </div>
    )
}

export default MessageContainer