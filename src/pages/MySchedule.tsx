
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import { Calendar, CalendarDays, Share2 } from 'lucide-react';
import { Loader, CardSkeleton } from '@/components/ui/loader';
import ShareButtons from '@/components/ShareButtons';

const MySchedule: React.FC = () => {
  const { user } = useAuth();
  const { getUserRsvpEvents } = useEvents();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const userEvents = getUserRsvpEvents(user.id);
  
  // Group events by date
  const eventsByDate = userEvents.reduce<Record<string, typeof userEvents>>((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});
  
  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">My Schedule</h1>
            <p className="text-muted-foreground">Your personalized calendar of events</p>
          </div>
          
          {userEvents.length > 0 && !isLoading && (
            <div className="mt-4 sm:mt-0 flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
              <span className="text-sm">Share my schedule</span>
              <ShareButtons
                title={`${user.name}'s Event Schedule`}
                text={`Check out my upcoming campus events!`}
              />
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-6 w-24 skeleton rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <div className="h-6 w-24 skeleton rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(2)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : userEvents.length === 0 ? (
          <div className="gradient-card-orange p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-orange-400 opacity-80" />
            <h3 className="text-lg font-medium mb-2">Your schedule is empty</h3>
            <p className="text-muted-foreground mb-4">
              You haven't RSVP'd to any upcoming events yet.
            </p>
            <a
              href="/events"
              className="btn-primary inline-flex"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date} className="animate-fade-in">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 text-primary font-medium rounded-full px-4 py-1 flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="ml-4 text-muted-foreground">
                    {eventsByDate[date].length} {eventsByDate[date].length === 1 ? 'event' : 'events'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventsByDate[date].map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MySchedule;
