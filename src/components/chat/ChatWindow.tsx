
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '../../contexts/ChatContext';
import { MessageSquare } from 'lucide-react';

const ChatWindow = () => {
  const { activeConversation, contacts } = useChat();
  
  const activeContact = activeConversation 
    ? contacts.find(c => c.id === activeConversation.contactId)
    : null;

  if (!activeConversation || !activeContact) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No conversation selected
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a contact from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ChatHeader contact={activeContact} />
      <MessageList messages={activeConversation.messages} />
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
