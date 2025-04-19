
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import { Calendar } from 'lucide-react';

const MySchedule: React.FC = () => {
  const { user } = useAuth();
  const { getUserRsvpEvents } = useEvents();
  
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
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Schedule</h1>
          <p className="text-muted-foreground">Your personalized calendar of events</p>
        </div>
        
        {userEvents.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
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
              <div key={date}>
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 text-primary font-medium rounded-full px-4 py-1">
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
