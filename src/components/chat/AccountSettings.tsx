
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, BellOff, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, userStatus, setUserStatus } = useChat();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const handleStatusChange = (status: 'online' | 'away' | 'busy' | 'invisible') => {
    setUserStatus(status);
    toast({
      title: "Status updated",
      description: `Your status has been changed to ${status}`,
    });
  };

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 border-green-200';
      case 'away': return 'text-yellow-600 border-yellow-200';
      case 'busy': return 'text-red-600 border-red-200';
      case 'invisible': return 'text-gray-600 border-gray-200';
      default: return 'text-gray-600 border-gray-200';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'invisible': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

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
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusIndicator(userStatus)} rounded-full border-2 border-background`} />
          </div>
          
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
          
          <Badge variant="outline" className={`mx-auto ${getStatusColor(userStatus)}`}>
            <div className={`w-2 h-2 ${getStatusIndicator(userStatus)} rounded-full mr-2`} />
            {userStatus}
          </Badge>
        </CardHeader>
      </Card>

      {/* Settings Section */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4" />
            Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Status Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={userStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Online
                    </div>
                  </SelectItem>
                  <SelectItem value="away">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      Away
                    </div>
                  </SelectItem>
                  <SelectItem value="busy">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Busy
                    </div>
                  </SelectItem>
                  <SelectItem value="invisible">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      Invisible
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-sm">Dark Mode</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>

            <Separator />

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Profile Information</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Name: {user.name}</div>
                <div>Email: {user.email}</div>
                <div>Status: {userStatus}</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">App Version</p>
              <p className="text-sm text-muted-foreground">v2.0.0</p>
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
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
