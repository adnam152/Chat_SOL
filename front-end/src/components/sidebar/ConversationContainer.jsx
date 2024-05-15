import React from 'react';
import Conversation from './Conversation';

function ConversationContainer() {
    return (
        <div className='mt-2 flex-1 overflow-y-auto custom-scrollbar pe-3 border-b border-info'>
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
        </div>
    )
}

export default ConversationContainer