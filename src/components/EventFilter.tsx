
import React, { useState } from 'react';
import { EventCategory, categoryEmojis, categoryNames } from '@/types';
import { Calendar, Filter, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';

interface EventFilterProps {
  selectedCategory: EventCategory | 'all';
  setSelectedCategory: (category: EventCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange?: [Date | null, Date | null];
  setDateRange?: (range: [Date | null, Date | null]) => void;
  showUserEvents?: boolean;
  setShowUserEvents?: (show: boolean) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  showUserEvents,
  setShowUserEvents,
}) => {
  const { user } = useAuth();
  const categories: (EventCategory | 'all')[] = ['all', 'tech', 'cultural', 'seminar', 'sports', 'social', 'career', 'other'];
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  
  // Determine if there are active filters
  const hasActiveFilters = selectedCategory !== 'all' || 
                          (dateRange && (dateRange[0] !== null || dateRange[1] !== null)) || 
                          timeOfDay !== 'all' || 
                          (showUserEvents && showUserEvents === true);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleTimeOfDayChange = (value: 'all' | 'morning' | 'afternoon' | 'evening') => {
    setTimeOfDay(value);
  };
  
  const handleClearFilters = () => {
    setSelectedCategory('all');
    if (setDateRange) setDateRange([null, null]);
    setTimeOfDay('all');
    if (setShowUserEvents) setShowUserEvents(false);
    setSearchQuery('');
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-12 pl-4 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute right-3 top-3.5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* Advanced Filters Button */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={`flex items-center gap-2 h-12 px-4 ${hasActiveFilters ? 'border-primary text-primary' : ''}`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                  !
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Advanced Filters</h3>
              
              {/* Date Range Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Date Range
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-8">Today</Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">This Week</Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">This Month</Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">Custom</Button>
                </div>
              </div>
              
              {/* Time of Day Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Time of Day
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={timeOfDay === 'morning' ? 'default' : 'outline'} 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => handleTimeOfDayChange(timeOfDay === 'morning' ? 'all' : 'morning')}
                  >
                    Morning
                  </Button>
                  <Button 
                    variant={timeOfDay === 'afternoon' ? 'default' : 'outline'} 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => handleTimeOfDayChange(timeOfDay === 'afternoon' ? 'all' : 'afternoon')}
                  >
                    Afternoon
                  </Button>
                  <Button 
                    variant={timeOfDay === 'evening' ? 'default' : 'outline'} 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => handleTimeOfDayChange(timeOfDay === 'evening' ? 'all' : 'evening')}
                  >
                    Evening
                  </Button>
                </div>
              </div>
              
              {/* Max Capacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" /> Maximum Attendees
                  </label>
                  <span className="text-xs text-muted-foreground">50</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={10} />
              </div>
              
              {/* Show Only My Events */}
              {user && setShowUserEvents && (
                <div className="flex items-center justify-between space-y-0">
                  <label className="text-sm">Show only my RSVPs</label>
                  <Switch 
                    checked={showUserEvents} 
                    onCheckedChange={setShowUserEvents} 
                  />
                </div>
              )}
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-2 no-scrollbar">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? category === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : `bg-event-${category} text-white`
                  : 'bg-accent/10 hover:bg-accent/20'
              }`}
            >
              {category !== 'all' && (
                <span className="mr-1">{categoryEmojis[category]}</span>
              )}
              {category === 'all' ? 'All Events' : categoryNames[category]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFilter;
