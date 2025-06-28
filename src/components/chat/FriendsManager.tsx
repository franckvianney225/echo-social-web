
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Users, Clock, Compass } from 'lucide-react';
import UserSearch from './UserSearch';
import FriendRequests from './FriendRequests';
import DiscoverUsers from './DiscoverUsers';
import { useFriend } from '../../contexts/FriendContext';

interface FriendsManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendsManager: React.FC<FriendsManagerProps> = ({ isOpen, onClose }) => {
  const { receivedRequests, friends, discoverableUsers } = useFriend();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Friends Manager
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
              <TabsTrigger value="discover" className="gap-2">
                <Compass className="w-4 h-4" />
                Discover
                <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                  {discoverableUsers.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Search
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2">
                <Clock className="w-4 h-4" />
                Requests
                {receivedRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                    {receivedRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="friends" className="gap-2">
                <Users className="w-4 h-4" />
                Friends
                <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                  {friends.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="px-4 pb-4 max-h-96 overflow-y-auto">
              <TabsContent value="discover" className="mt-0">
                <DiscoverUsers />
              </TabsContent>
              
              <TabsContent value="search" className="mt-0">
                <UserSearch />
              </TabsContent>
              
              <TabsContent value="requests" className="mt-0">
                <FriendRequests />
              </TabsContent>
              
              <TabsContent value="friends" className="mt-0">
                <div className="space-y-2">
                  {friends.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No friends yet</p>
                      <p className="text-sm">Start by discovering users to add!</p>
                    </div>
                  ) : (
                    friends.map((friend) => (
                      <div key={friend.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-medium">{friend.name}</h3>
                          <p className="text-sm text-muted-foreground">{friend.email}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsManager;
