
import React, { useState, useEffect } from 'react';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import EventFilter from '@/components/EventFilter';
import { EventCategory } from '@/types';
import { Loader, CardSkeleton } from '@/components/ui/loader';

const Events: React.FC = () => {
  const { events } = useEvents();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [showUserEvents, setShowUserEvents] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter events based on all criteria
  const filteredEvents = events.filter(event => {
    // Category filter
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    // Search query filter
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    // User events filter
    const matchesUserEvents = !showUserEvents || (user && event.attendees.includes(user.id));
    
    // Date range filter - for now just a placeholder since we don't have actual implementation
    const matchesDateRange = true; // Placeholder
    
    return matchesCategory && matchesSearch && matchesUserEvents && matchesDateRange;
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Explore Events</h1>
          <p className="text-muted-foreground">Find and filter all campus events</p>
        </div>
        
        <EventFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateRange={dateRange}
          setDateRange={setDateRange}
          showUserEvents={showUserEvents}
          setShowUserEvents={setShowUserEvents}
        />
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground mb-2">No events found matching your criteria</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setShowUserEvents(false);
                setDateRange([null, null]);
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;
