
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Camera } from 'lucide-react';
import { Contact } from '../../contexts/ChatContext';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  contact: Contact;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  return (
    <div className="border-b border-border p-4 bg-background">
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
              contact.status === 'offline' && "bg-gray-400"
            )} />
          </div>
          
          <div>
            <h2 className="font-semibold">{contact.name}</h2>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs px-2 py-0",
                  contact.status === 'online' && "text-green-600 border-green-200",
                  contact.status === 'away' && "text-yellow-600 border-yellow-200",
                  contact.status === 'offline' && "text-gray-600 border-gray-200"
                )}
              >
                {contact.status}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Camera className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
