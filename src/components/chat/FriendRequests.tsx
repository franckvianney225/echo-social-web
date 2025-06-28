
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock } from 'lucide-react';
import { useFriend } from '../../contexts/FriendContext';

const FriendRequests = () => {
  const { 
    receivedRequests, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    allUsers 
  } = useFriend();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (receivedRequests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No pending friend requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">
          Friend Requests
        </h4>
        <Badge variant="secondary" className="text-xs">
          {receivedRequests.length}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {receivedRequests.map((request) => {
          const sender = allUsers.find(user => user.id === request.senderId);
          if (!sender) return null;
          
          return (
            <div
              key={request.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={sender.avatar} alt={sender.name} />
                  <AvatarFallback>{sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium">{sender.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(request.timestamp)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => acceptFriendRequest(request.id)}
                  className="gap-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-3 h-3" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectFriendRequest(request.id)}
                  className="gap-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-3 h-3" />
                  Reject
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendRequests;
