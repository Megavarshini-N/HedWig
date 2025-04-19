import React from 'react';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import { EventCategory } from '@/types';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    getEventsHappeningToday, 
    getUpcomingEvents, 
    getPopularEvents, 
    getEventsByCategory
  } = useEvents();
  const { user } = useAuth();
  
  const todayEvents = getEventsHappeningToday();
  const upcomingEvents = getUpcomingEvents().slice(0, 4); // Limit to 4 events
  const popularEvents = getPopularEvents().slice(0, 4); // Limit to 4 events
  
  // Get events based on user interests
  const recommendedEvents = user
    ? user.interests.flatMap(interest => getEventsByCategory(interest as EventCategory))
        .filter((event, index, self) => 
          index === self.findIndex((e) => e.id === event.id)
        )
        .slice(0, 4)
    : [];
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="glass-card p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {user ? `Welcome back, ${user.name.split(' ')[0]} to HedWig!` : 'Welcome to HedWig'}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Your hub for campus events. Discover, join, and connect with activities that interest you.
            </p>
          </div>
        </section>
        
        {/* Today's Events */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Happening Today</h2>
            <Link to="/events" className="text-primary text-sm flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {todayEvents.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-muted-foreground">No events scheduled for today</p>
              <Link to="/events" className="text-primary text-sm mt-2 inline-block hover:underline">
                Browse upcoming events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {todayEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
        
        {/* Events Based on User Interests */}
        {user && recommendedEvents.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recommended For You</h2>
              <Link to="/events" className="text-primary text-sm flex items-center hover:underline">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
        
        {/* Upcoming Events */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <Link to="/events" className="text-primary text-sm flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
        
        {/* Popular Events */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Popular This Month</h2>
            <Link to="/events" className="text-primary text-sm flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
