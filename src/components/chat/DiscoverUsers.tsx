
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { UserPlus, MapPin, Calendar, Ruler, Search, Users } from 'lucide-react';
import { useFriend } from '../../contexts/FriendContext';
import { cn } from '@/lib/utils';

const DiscoverUsers = () => {
  const { 
    discoverableUsers, 
    userFilters, 
    setUserFilters, 
    sendFriendRequest 
  } = useFriend();

  const handleFilterChange = (key: keyof typeof userFilters, value: any) => {
    setUserFilters({
      ...userFilters,
      [key]: value
    });
  };

  const clearFilters = () => {
    setUserFilters({
      location: '',
      minAge: 18,
      maxAge: 65,
      minHeight: 150,
      maxHeight: 200,
      searchQuery: ''
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Filters</h4>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
        
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-xs">Search by name or bio</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search users..."
              value={userFilters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-xs">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Filter by location..."
              value={userFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Age Range */}
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Age: {userFilters.minAge} - {userFilters.maxAge}
          </Label>
          <div className="space-y-2">
            <Slider
              value={[userFilters.minAge]}
              onValueChange={(value) => handleFilterChange('minAge', value[0])}
              max={65}
              min={18}
              step={1}
              className="w-full"
            />
            <Slider
              value={[userFilters.maxAge]}
              onValueChange={(value) => handleFilterChange('maxAge', value[0])}
              max={65}
              min={18}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Height Range */}
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Ruler className="w-3 h-3" />
            Height: {userFilters.minHeight}cm - {userFilters.maxHeight}cm
          </Label>
          <div className="space-y-2">
            <Slider
              value={[userFilters.minHeight]}
              onValueChange={(value) => handleFilterChange('minHeight', value[0])}
              max={200}
              min={150}
              step={1}
              className="w-full"
            />
            <Slider
              value={[userFilters.maxHeight]}
              onValueChange={(value) => handleFilterChange('maxHeight', value[0])}
              max={200}
              min={150}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">
            Discover Users
          </h4>
          <Badge variant="secondary" className="text-xs">
            {discoverableUsers.length} found
          </Badge>
        </div>

        {discoverableUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No users found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {discoverableUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
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
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => sendFriendRequest(user.id)}
                      className="gap-1 ml-2"
                    >
                      <UserPlus className="w-3 h-3" />
                      Add Friend
                    </Button>
                  </div>
                  
                  {user.bio && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.age && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{user.age} years</span>
                      </div>
                    )}
                    {user.height && (
                      <div className="flex items-center gap-1">
                        <Ruler className="w-3 h-3" />
                        <span>{user.height}cm</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverUsers;
