import React from 'react';
import InputSearch from './InputSearch';
import ConversationContainer from './ConversationContainer';
import Logout from './Logout';

function Sidebar() {
    return (
        <div className="h-full flex flex-col py-4 ps-4">
            <InputSearch />
            <ConversationContainer />
            <Logout />
        </div>
    )
}

export default Sidebar