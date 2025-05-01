
import React, { useState, useEffect } from 'react';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import { EventCategory } from '@/types';
import { Link } from 'react-router-dom';
import { ChevronRight, CalendarDays, Star, Clock, Calendar, Users } from 'lucide-react';
import { Loader, CardSkeleton } from '@/components/ui/loader';
import ShareButtons from '@/components/ShareButtons';

const Dashboard: React.FC = () => {
  const { 
    getEventsHappeningToday, 
    getUpcomingEvents, 
    getPopularEvents, 
    getEventsByCategory
  } = useEvents();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
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
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Welcome Section with Hero Image */}
            <section className="mb-8 relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-10 z-0"></div>
              <div className="gradient-card p-8 md:p-10 relative z-10">
                <div className="max-w-3xl">
                  <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome to HedWig!'}
                  </h1>
                  <p className="text-foreground/80 text-lg max-w-2xl mb-6">
                    Your hub for campus events. Stay connected to what's happening on campus and never miss an important event.
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center">
                      <Calendar className="h-6 w-6 text-primary mb-1" />
                      <span className="text-2xl font-semibold">{todayEvents.length}</span>
                      <span className="text-xs text-muted-foreground">Today's Events</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center">
                      <CalendarDays className="h-6 w-6 text-secondary mb-1" />
                      <span className="text-2xl font-semibold">{upcomingEvents.length}</span>
                      <span className="text-xs text-muted-foreground">Upcoming</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center">
                      <Users className="h-6 w-6 text-accent mb-1" />
                      <span className="text-2xl font-semibold">{user?.eventsAttended.length || 0}</span>
                      <span className="text-xs text-muted-foreground">Attended</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center">
                      <Star className="h-6 w-6 text-orange-500 mb-1" />
                      <span className="text-2xl font-semibold">{recommendedEvents.length}</span>
                      <span className="text-xs text-muted-foreground">For You</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Today's Events */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Happening Today
                </h2>
                <Link to="/events" className="text-primary text-sm flex items-center hover:underline">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              {todayEvents.length === 0 ? (
                <div className="gradient-card-teal p-6 text-center">
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
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-500" />
                    Recommended For You
                  </h2>
                  <Link to="/events" className="text-primary text-sm flex items-center hover:underline">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recommendedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                
                {/* Share section */}
                <div className="mt-4 flex justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Share these recommendations:</span>
                    <ShareButtons 
                      title="Check out these campus events!"
                      text={`Events recommended for ${user.name} at SKASC`}
                    />
                  </div>
                </div>
              </section>
            )}
            
            {/* Upcoming Events */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-secondary" />
                  Upcoming Events
                </h2>
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
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Popular This Month
                </h2>
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
          </>
        )}
      </main>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <>
      {/* Welcome Section Skeleton */}
      <section className="mb-8">
        <div className="gradient-card p-8 md:p-10">
          <div className="h-8 w-3/4 max-w-md skeleton rounded-md mb-3" />
          <div className="h-4 w-full max-w-xl skeleton rounded-md mb-2" />
          <div className="h-4 w-full max-w-lg skeleton rounded-md mb-6" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-xl">
                <div className="h-6 w-6 skeleton rounded-full mx-auto mb-2" />
                <div className="h-6 w-1/2 skeleton rounded-md mx-auto mb-1" />
                <div className="h-3 w-3/4 skeleton rounded-md mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Events Sections Skeleton */}
      {[...Array(3)].map((_, sectionIndex) => (
        <section key={sectionIndex} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-40 skeleton rounded-md" />
            <div className="h-4 w-20 skeleton rounded-md" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default Dashboard;
