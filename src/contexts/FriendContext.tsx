import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy' | 'invisible';
  lastSeen?: Date;
  location?: string;
  age?: number;
  height?: number;
  bio?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface UserFilters {
  location: string;
  minAge: number;
  maxAge: number;
  minHeight: number;
  maxHeight: number;
  searchQuery: string;
}

interface FriendContextType {
  allUsers: User[];
  friends: User[];
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  discoverableUsers: User[];
  userFilters: UserFilters;
  setUserFilters: (filters: UserFilters) => void;
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

// Enhanced mock users data with profile information
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    location: 'San Francisco, CA',
    age: 28,
    height: 175,
    bio: 'Software developer passionate about technology'
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    location: 'New York, NY',
    age: 25,
    height: 165,
    bio: 'Designer who loves creativity and innovation'
  },
  {
    id: '3',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
    status: 'away',
    location: 'Los Angeles, CA',
    age: 32,
    height: 180,
    bio: 'Marketing professional and outdoor enthusiast'
  },
  {
    id: '4',
    name: 'Carol Wilson',
    email: 'carol@example.com',
    avatar: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop&crop=face',
    status: 'busy',
    location: 'Chicago, IL',
    age: 29,
    height: 160,
    bio: 'Product manager with a passion for user experience'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    location: 'Austin, TX',
    age: 35,
    height: 185,
    bio: 'Entrepreneur building the next big thing'
  },
  {
    id: '6',
    name: 'Emma Davis',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c72000?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    location: 'Seattle, WA',
    age: 26,
    height: 170,
    bio: 'Data scientist exploring AI and machine learning'
  },
  {
    id: '7',
    name: 'Frank Miller',
    email: 'frank@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'away',
    location: 'Miami, FL',
    age: 31,
    height: 178,
    bio: 'Sales director with a love for travel'
  },
  {
    id: '8',
    name: 'Grace Lee',
    email: 'grace@example.com',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    location: 'San Francisco, CA',
    age: 24,
    height: 162,
    bio: 'UX designer creating beautiful digital experiences'
  },
  {
    id: '9',
    name: 'Henry Wilson',
    email: 'henry@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'busy',
    location: 'Boston, MA',
    age: 33,
    height: 183,
    bio: 'Financial analyst passionate about sustainable investing'
  },
  {
    id: '10',
    name: 'Isabella Garcia',
    email: 'isabella@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    location: 'Denver, CO',
    age: 27,
    height: 168,
    bio: 'Content creator and social media strategist'
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

  // Filter state
  const [userFilters, setUserFilters] = useState<UserFilters>({
    location: '',
    minAge: 18,
    maxAge: 65,
    minHeight: 150,
    maxHeight: 200,
    searchQuery: ''
  });

  // Get discoverable users (not friends, not current user, no pending requests)
  const [discoverableUsers, setDiscoverableUsers] = useState<User[]>([]);

  useEffect(() => {
    const friendIds = friends.map(f => f.id);
    const sentRequestIds = sentRequests.map(r => r.receiverId);
    const receivedRequestIds = receivedRequests.map(r => r.senderId);
    
    let filtered = allUsers.filter(user => 
      user.id !== currentUserId && 
      !friendIds.includes(user.id) &&
      !sentRequestIds.includes(user.id) &&
      !receivedRequestIds.includes(user.id)
    );

    // Apply filters
    if (userFilters.location) {
      filtered = filtered.filter(user => 
        user.location?.toLowerCase().includes(userFilters.location.toLowerCase())
      );
    }

    if (userFilters.searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(userFilters.searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(userFilters.searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(user =>
      (user.age || 0) >= userFilters.minAge &&
      (user.age || 0) <= userFilters.maxAge &&
      (user.height || 0) >= userFilters.minHeight &&
      (user.height || 0) <= userFilters.maxHeight
    );

    setDiscoverableUsers(filtered);
  }, [allUsers, friends, sentRequests, receivedRequests, userFilters, currentUserId]);

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
      discoverableUsers,
      userFilters,
      setUserFilters,
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
