
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Camera, Search, X } from 'lucide-react';
import { Contact } from '../../contexts/ChatContext';
import { useChat } from '../../contexts/ChatContext';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  contact: Contact;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  const [showSearch, setShowSearch] = useState(false);
  const { messageSearchQuery, setMessageSearchQuery } = useChat();

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setMessageSearchQuery('');
    }
  };

  return (
    <div className="border-b border-border bg-background">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              {/* Status indicator */}
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                contact.status === 'online' && "bg-green-500",
                contact.status === 'away' && "bg-yellow-500",
                contact.status === 'busy' && "bg-red-500",
                contact.status === 'invisible' && "bg-gray-400",
                contact.status === 'offline' && "bg-gray-400"
              )} />
            </div>
            
            <div>
              <h2 className="font-semibold">{contact.name}</h2>
              <div className="flex items-center gap-2">
                {contact.isTyping ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-green-600 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs">typing...</span>
                  </div>
                ) : (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs px-2 py-0",
                      contact.status === 'online' && "text-green-600 border-green-200",
                      contact.status === 'away' && "text-yellow-600 border-yellow-200",
                      contact.status === 'busy' && "text-red-600 border-red-200",
                      contact.status === 'invisible' && "text-gray-600 border-gray-200",
                      contact.status === 'offline' && "text-gray-600 border-gray-200"
                    )}
                  >
                    {contact.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSearchToggle}
              className="text-muted-foreground hover:text-foreground"
            >
              {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-4 pb-4">
          <Input
            placeholder="Search messages..."
            value={messageSearchQuery}
            onChange={(e) => setMessageSearchQuery(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
