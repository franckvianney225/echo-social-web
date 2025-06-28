
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();
  const { contacts } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderInfo = (senderId: string) => {
    if (senderId === user?.id) return user;
    return contacts.find(c => c.id === senderId);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isOwn = message.senderId === user?.id;
        const sender = getSenderInfo(message.senderId);
        const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId);
        
        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-2 max-w-[70%]",
              isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            {/* Avatar for received messages */}
            {!isOwn && (
              <div className="flex-shrink-0">
                {showAvatar ? (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={sender?.avatar} alt={sender?.name} />
                    <AvatarFallback className="text-xs">
                      {sender?.name.split(' ').map(n => n[0]).join('') || '?'}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            )}
            
            {/* Message bubble */}
            <div
              className={cn(
                "px-4 py-2 rounded-2xl max-w-full break-words",
                isOwn
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p
                className={cn(
                  "text-xs mt-1 opacity-70",
                  isOwn ? "text-right" : "text-left"
                )}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
