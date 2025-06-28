
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'attachment' | 'image';
  isEdited?: boolean;
  isPinned?: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy' | 'invisible';
  lastSeen?: Date;
  isTyping?: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  pinnedMessages: string[];
}

interface ChatContextType {
  contacts: Contact[];
  conversations: Conversation[];
  activeConversation: Conversation | null;
  searchQuery: string;
  messageSearchQuery: string;
  darkMode: boolean;
  userStatus: 'online' | 'away' | 'busy' | 'invisible';
  setSearchQuery: (query: string) => void;
  setMessageSearchQuery: (query: string) => void;
  selectConversation: (contactId: string) => void;
  sendMessage: (content: string, type?: 'text' | 'emoji' | 'image') => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  pinMessage: (messageId: string) => void;
  unpinMessage: (messageId: string) => void;
  toggleDarkMode: () => void;
  setUserStatus: (status: 'online' | 'away' | 'busy' | 'invisible') => void;
  filteredContacts: Contact[];
  filteredMessages: Message[];
  startTyping: (contactId: string) => void;
  stopTyping: (contactId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Enhanced mock data
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
    status: 'busy'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30)
  }
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    contactId: '2',
    unreadCount: 2,
    pinnedMessages: ['3'],
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
        type: 'text',
        isPinned: true
      }
    ]
  },
  {
    id: '2',
    contactId: '3',
    unreadCount: 0,
    pinnedMessages: [],
    messages: [
      {
        id: '4',
        senderId: '3',
        content: 'The project looks great! 🚀',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'text'
      },
      {
        id: '5',
        senderId: '1',
        content: 'Thanks! I\'ve been working on it all week.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
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
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [userStatus, setUserStatus] = useState<'online' | 'away' | 'busy' | 'invisible'>('online');
  const [typingTimeouts, setTypingTimeouts] = useState<Record<string, NodeJS.Timeout>>({});

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = activeConversation?.messages.filter(message =>
    message.content.toLowerCase().includes(messageSearchQuery.toLowerCase())
  ) || [];

  const selectConversation = (contactId: string) => {
    let conversation = conversations.find(conv => conv.contactId === contactId);
    
    if (!conversation) {
      conversation = {
        id: Date.now().toString(),
        contactId,
        messages: [],
        unreadCount: 0,
        pinnedMessages: []
      };
      setConversations(prev => [...prev, conversation!]);
    }
    
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversation!.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
    
    setActiveConversation(conversation);
  };

  const sendMessage = (content: string, type: 'text' | 'emoji' | 'image' = 'text') => {
    if (!activeConversation || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1',
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

    // Simulate receiving a response after a delay
    setTimeout(() => {
      const responses = [
        "That's interesting!",
        "I see what you mean 👍",
        "Absolutely!",
        "Thanks for sharing that",
        "Let me think about it",
        "Good point!"
      ];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeConversation.contactId,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
      };

      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? {
                ...conv,
                messages: [...conv.messages, responseMessage],
                lastMessage: responseMessage,
                unreadCount: conv.unreadCount + 1
              }
            : conv
        )
      );

      if (activeConversation) {
        setActiveConversation(prev =>
          prev ? {
            ...prev,
            messages: [...prev.messages, responseMessage],
            lastMessage: responseMessage
          } : null
        );
      }
    }, 2000 + Math.random() * 3000);
  };

  const editMessage = (messageId: string, newContent: string) => {
    if (!activeConversation) return;

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === messageId
                  ? { ...msg, content: newContent, isEdited: true }
                  : msg
              )
            }
          : conv
      )
    );

    setActiveConversation(prev =>
      prev ? {
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId
            ? { ...msg, content: newContent, isEdited: true }
            : msg
        )
      } : null
    );
  };

  const deleteMessage = (messageId: string) => {
    if (!activeConversation) return;

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: conv.messages.filter(msg => msg.id !== messageId),
              pinnedMessages: conv.pinnedMessages.filter(id => id !== messageId)
            }
          : conv
      )
    );

    setActiveConversation(prev =>
      prev ? {
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== messageId),
        pinnedMessages: prev.pinnedMessages.filter(id => id !== messageId)
      } : null
    );
  };

  const pinMessage = (messageId: string) => {
    if (!activeConversation) return;

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === messageId ? { ...msg, isPinned: true } : msg
              ),
              pinnedMessages: [...conv.pinnedMessages, messageId]
            }
          : conv
      )
    );

    setActiveConversation(prev =>
      prev ? {
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId ? { ...msg, isPinned: true } : msg
        ),
        pinnedMessages: [...prev.pinnedMessages, messageId]
      } : null
    );
  };

  const unpinMessage = (messageId: string) => {
    if (!activeConversation) return;

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === messageId ? { ...msg, isPinned: false } : msg
              ),
              pinnedMessages: conv.pinnedMessages.filter(id => id !== messageId)
            }
          : conv
      )
    );

    setActiveConversation(prev =>
      prev ? {
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId ? { ...msg, isPinned: false } : msg
        ),
        pinnedMessages: prev.pinnedMessages.filter(id => id !== messageId)
      } : null
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const startTyping = (contactId: string) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === contactId ? { ...contact, isTyping: true } : contact
      )
    );

    // Clear existing timeout
    if (typingTimeouts[contactId]) {
      clearTimeout(typingTimeouts[contactId]);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      stopTyping(contactId);
    }, 3000);

    setTypingTimeouts(prev => ({ ...prev, [contactId]: timeout }));
  };

  const stopTyping = (contactId: string) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === contactId ? { ...contact, isTyping: false } : contact
      )
    );

    if (typingTimeouts[contactId]) {
      clearTimeout(typingTimeouts[contactId]);
      setTypingTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[contactId];
        return newTimeouts;
      });
    }
  };

  return (
    <ChatContext.Provider value={{
      contacts,
      conversations,
      activeConversation,
      searchQuery,
      messageSearchQuery,
      darkMode,
      userStatus,
      setSearchQuery,
      setMessageSearchQuery,
      selectConversation,
      sendMessage,
      editMessage,
      deleteMessage,
      pinMessage,
      unpinMessage,
      toggleDarkMode,
      setUserStatus,
      filteredContacts,
      filteredMessages,
      startTyping,
      stopTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
};
