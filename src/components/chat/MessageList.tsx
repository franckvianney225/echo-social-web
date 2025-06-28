
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, Pin, PinOff, Check, X } from 'lucide-react';
import { Message } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();
  const { contacts, editMessage, deleteMessage, pinMessage, unpinMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

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

  const handleEditStart = (message: Message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  const handleEditSave = (messageId: string) => {
    if (editContent.trim()) {
      editMessage(messageId, editContent.trim());
    }
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handlePinToggle = (message: Message) => {
    if (message.isPinned) {
      unpinMessage(message.id);
    } else {
      pinMessage(message.id);
    }
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
        const isEditing = editingMessageId === message.id;
        
        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-2 max-w-[70%] group",
              isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
            onMouseEnter={() => setHoveredMessageId(message.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
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
            <div className="flex-1 max-w-full">
              <div
                className={cn(
                  "px-4 py-2 rounded-2xl max-w-full break-words relative",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md",
                  message.isPinned && "ring-2 ring-yellow-400 ring-opacity-50"
                )}
              >
                {/* Pin indicator */}
                {message.isPinned && (
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      <Pin className="w-3 h-3" />
                    </Badge>
                  </div>
                )}

                {/* Message content */}
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="bg-background text-foreground"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditSave(message.id)}
                        className="h-6 px-2"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleEditCancel}
                        className="h-6 px-2"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={cn(
                          "text-xs opacity-70",
                          isOwn ? "text-right" : "text-left"
                        )}
                      >
                        {formatTime(message.timestamp)}
                        {message.isEdited && (
                          <span className="ml-1 text-xs opacity-50">(edited)</span>
                        )}
                      </p>
                    </div>
                  </>
                )}

                {/* Message actions */}
                {isOwn && hoveredMessageId === message.id && !isEditing && (
                  <div className="absolute -top-2 -left-2 flex gap-1 bg-background border rounded-md p-1 shadow-md">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditStart(message)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePinToggle(message)}
                      className="h-6 w-6 p-0"
                    >
                      {message.isPinned ? (
                        <PinOff className="w-3 h-3" />
                      ) : (
                        <Pin className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMessage(message.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
