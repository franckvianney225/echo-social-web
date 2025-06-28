
import React from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import AccountSettings from '../components/chat/AccountSettings';

const ChatPage = () => {
  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Contacts */}
      <div className="w-80 border-r border-border flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>

      {/* Right Sidebar - Account Settings */}
      <div className="w-80 border-l border-border flex-shrink-0">
        <AccountSettings />
      </div>
    </div>
  );
};

export default ChatPage;
