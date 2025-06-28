
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'attachment';
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Conversation {
  id: string;
  contactId: string;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatContextType {
  contacts: Contact[];
  conversations: Conversation[];
  activeConversation: Conversation | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectConversation: (contactId: string) => void;
  sendMessage: (content: string, type?: 'text' | 'emoji') => void;
  filteredContacts: Contact[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Mock data
const mockContacts: Contact[] = [
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
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  }
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    contactId: '2',
    unreadCount: 2,
    messages: [
      {
        id: '1',
        senderId: '2',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        type: 'text'
      },
      {
        id: '2',
        senderId: '1',
        content: 'I\'m doing great! Thanks for asking 😊',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'text'
      },
      {
        id: '3',
        senderId: '2',
        content: 'That\'s awesome! Want to grab coffee later?',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        type: 'text'
      }
    ]
  },
  {
    id: '2',
    contactId: '3',
    unreadCount: 0,
    messages: [
      {
        id: '4',
        senderId: '3',
        content: 'The project looks great! 🚀',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'text'
      }
    ]
  }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectConversation = (contactId: string) => {
    let conversation = conversations.find(conv => conv.contactId === contactId);
    
    if (!conversation) {
      // Create new conversation if it doesn't exist
      conversation = {
        id: Date.now().toString(),
        contactId,
        messages: [],
        unreadCount: 0
      };
      setConversations(prev => [...prev, conversation!]);
    }
    
    // Mark conversation as read
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversation!.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
    
    setActiveConversation(conversation);
  };

  const sendMessage = (content: string, type: 'text' | 'emoji' = 'text') => {
    if (!activeConversation || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1', // Current user ID
      content: content.trim(),
      timestamp: new Date(),
      type
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: newMessage
            }
          : conv
      )
    );

    setActiveConversation(prev =>
      prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: newMessage
      } : null
    );
  };

  return (
    <ChatContext.Provider value={{
      contacts,
      conversations,
      activeConversation,
      searchQuery,
      setSearchQuery,
      selectConversation,
      sendMessage,
      filteredContacts
    }}>
      {children}
    </ChatContext.Provider>
  );
};
