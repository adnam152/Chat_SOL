import React, { useEffect, useState } from 'react';
import Conversation from './Conversation';
import useConversations from '../../hooks/useConversations';

function ConversationContainer() {
    const [conversations, setConversations] = useState([]);

    // Get Conversations
    useEffect(() => {
        const getConversations = useConversations(setConversations);
        getConversations();
    },[])
    
    return (
        <div className='mt-2 flex-1 overflow-y-auto custom-scrollbar pe-3 border-b border-info'>
            {conversations.map((conversation) => {
                return <Conversation key={conversation._id} conversation={conversation} />
            })}
        </div>
    )
}

export default ConversationContainer