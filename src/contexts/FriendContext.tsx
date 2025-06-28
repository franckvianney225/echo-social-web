
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy' | 'invisible';
  lastSeen?: Date;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

interface FriendContextType {
  allUsers: User[];
  friends: User[];
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  searchUsers: (query: string) => User[];
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  isFriend: (userId: string) => boolean;
  hasReceivedRequest: (userId: string) => boolean;
  hasSentRequest: (userId: string) => boolean;
  currentUserId: string;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const useFriend = () => {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error('useFriend must be used within a FriendProvider');
  }
  return context;
};

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop&crop=face',
    status: 'online'
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop&crop=face',
    status: 'online'
  },
  {
    id: '3',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
    status: 'away'
  },
  {
    id: '4',
    name: 'Carol Wilson',
    email: 'carol@example.com',
    avatar: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop&crop=face',
    status: 'busy'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '6',
    name: 'Emma Davis',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c72000?w=150&h=150&fit=crop&crop=face',
    status: 'online'
  },
  {
    id: '7',
    name: 'Frank Miller',
    email: 'frank@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'away'
  }
];

export const FriendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUserId = '1'; // Demo user ID
  const [allUsers] = useState<User[]>(mockUsers);
  const [friends, setFriends] = useState<User[]>([
    mockUsers.find(u => u.id === '2')!,
    mockUsers.find(u => u.id === '3')!
  ]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      senderId: '4',
      receiverId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      status: 'pending'
    }
  ]);

  const searchUsers = (query: string): User[] => {
    if (!query.trim()) return [];
    
    return allUsers.filter(user => 
      user.id !== currentUserId && // Exclude current user
      (user.name.toLowerCase().includes(query.toLowerCase()) ||
       user.email.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const sendFriendRequest = (userId: string) => {
    if (userId === currentUserId || isFriend(userId) || hasSentRequest(userId)) {
      return;
    }

    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: userId,
      timestamp: new Date(),
      status: 'pending'
    };

    setSentRequests(prev => [...prev, newRequest]);

    // Simulate the other user receiving the request
    if (userId !== currentUserId) {
      setReceivedRequests(prev => [...prev, newRequest]);
    }
  };

  const acceptFriendRequest = (requestId: string) => {
    const request = receivedRequests.find(req => req.id === requestId);
    if (!request) return;

    const newFriend = allUsers.find(user => user.id === request.senderId);
    if (newFriend) {
      setFriends(prev => [...prev, newFriend]);
    }

    setReceivedRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' as const } : req
      ).filter(req => req.status === 'pending')
    );
  };

  const rejectFriendRequest = (requestId: string) => {
    setReceivedRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      ).filter(req => req.status === 'pending')
    );
  };

  const isFriend = (userId: string): boolean => {
    return friends.some(friend => friend.id === userId);
  };

  const hasReceivedRequest = (userId: string): boolean => {
    return receivedRequests.some(req => 
      req.senderId === userId && req.status === 'pending'
    );
  };

  const hasSentRequest = (userId: string): boolean => {
    return sentRequests.some(req => 
      req.receiverId === userId && req.status === 'pending'
    );
  };

  return (
    <FriendContext.Provider value={{
      allUsers,
      friends,
      sentRequests,
      receivedRequests,
      searchUsers,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      isFriend,
      hasReceivedRequest,
      hasSentRequest,
      currentUserId
    }}>
      {children}
    </FriendContext.Provider>
  );
};
