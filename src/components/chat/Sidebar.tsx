
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, UserPlus } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useFriend } from '../../contexts/FriendContext';
import { cn } from '@/lib/utils';
import FriendsManager from './FriendsManager';

const Sidebar = () => {
  const [showFriendsManager, setShowFriendsManager] = useState(false);
  const { 
    conversations, 
    activeConversation, 
    searchQuery, 
    setSearchQuery, 
    selectConversation 
  } = useChat();
  
  const { friends, receivedRequests } = useFriend();

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConversationForContact = (contactId: string) => {
    return conversations.find(conv => conv.contactId === contactId);
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">Chats</h1>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFriendsManager(true)}
              className="relative"
            >
              <UserPlus className="w-4 h-4" />
              {receivedRequests.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 px-1 py-0 text-xs min-w-4 h-4"
                >
                  {receivedRequests.length}
                </Badge>
              )}
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery ? 'No friends found' : 'No friends yet'}
              {!searchQuery && (
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => setShowFriendsManager(true)}
                  className="mt-2"
                >
                  Add friends to start chatting
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredFriends.map((friend) => {
                const conversation = getConversationForContact(friend.id);
                const isActive = activeConversation?.contactId === friend.id;
                const lastMessage = conversation?.messages[conversation.messages.length - 1];
                
                return (
                  <div
                    key={friend.id}
                    onClick={() => selectConversation(friend.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted",
                      isActive && "bg-muted"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      {/* Status indicator */}
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                        friend.status === 'online' && "bg-green-500",
                        friend.status === 'away' && "bg-yellow-500",
                        friend.status === 'offline' && "bg-gray-400"
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{friend.name}</h3>
                        {conversation?.unreadCount && conversation.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2 px-2 py-0 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage ? lastMessage.content : 'No messages yet'}
                        </p>
                        
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {formatLastSeen(lastMessage.timestamp)}
                          </span>
                        )}
                        
                        {friend.status === 'offline' && friend.lastSeen && !lastMessage && (
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {formatLastSeen(friend.lastSeen)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <FriendsManager 
        isOpen={showFriendsManager}
        onClose={() => setShowFriendsManager(false)}
      />
    </>
  );
};

export default Sidebar;
