
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Bell, BellOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="h-full flex flex-col bg-background p-4">
      {/* User Profile Section */}
      <Card className="mb-4">
        <CardHeader className="text-center pb-4">
          <div className="relative mx-auto mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background" />
          </div>
          
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
          
          <Badge variant="outline" className="mx-auto text-green-600 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            {user.status}
          </Badge>
        </CardHeader>
      </Card>

      {/* Settings Section */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4" />
            Account Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Notifications</span>
              </div>
              <Button variant="ghost" size="sm">
                <BellOff className="w-4 h-4" />
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Profile Information</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Name: {user.name}</div>
                <div>Email: {user.email}</div>
                <div>Status: {user.status}</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">App Version</p>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <div className="mt-4">
        <Button 
          onClick={handleLogout}
          variant="destructive" 
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
