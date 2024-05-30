import React from 'react';

function Loading() {
    return (
        <div className='fixed h-full w-full flex items-center justify-center' id="loading-element">
            <div className='absolute h-full w-full bg-slate-950 opacity-50'></div>
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    )
}

export default Loading