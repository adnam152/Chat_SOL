import { TiMessages } from "react-icons/ti";

function NoChatSelected() {
    return (
        <div className='flex flex-col items-center justify-center h-full'>
            <div>Select a chat group to start messaging!</div>
            <div className='text-5xl'>
                <TiMessages />
            </div>
        </div>
    )
}

export default NoChatSelected