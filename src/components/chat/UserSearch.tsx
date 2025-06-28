
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Check, Clock } from 'lucide-react';
import { useFriend } from '../../contexts/FriendContext';
import { cn } from '@/lib/utils';

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { 
    searchUsers, 
    sendFriendRequest, 
    isFriend, 
    hasReceivedRequest, 
    hasSentRequest 
  } = useFriend();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchUsers(query));
    } else {
      setSearchResults([]);
    }
  };

  const getButtonState = (userId: string) => {
    if (isFriend(userId)) return 'friend';
    if (hasReceivedRequest(userId)) return 'received';
    if (hasSentRequest(userId)) return 'sent';
    return 'none';
  };

  const renderActionButton = (user: any) => {
    const state = getButtonState(user.id);

    switch (state) {
      case 'friend':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="text-sm">Friends</span>
          </div>
        );
      case 'received':
        return (
          <Badge variant="secondary" className="text-xs">
            Sent you a request
          </Badge>
        );
      case 'sent':
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Sent</span>
          </div>
        );
      default:
        return (
          <Button
            size="sm"
            onClick={() => sendFriendRequest(user.id)}
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Friend
          </Button>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <h4 className="text-sm font-medium text-muted-foreground">
            Search Results ({searchResults.length})
          </h4>
          
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                    user.status === 'online' && "bg-green-500",
                    user.status === 'away' && "bg-yellow-500",
                    user.status === 'busy' && "bg-red-500",
                    user.status === 'offline' && "bg-gray-400"
                  )} />
                </div>
                
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              {renderActionButton(user)}
            </div>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No users found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
