
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { categoryEmojis } from '@/types';
import { Link, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { events } = useEvents();
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Get events the user has attended
  const attendedEvents = events.filter(event => user.eventsAttended.includes(event.id));
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card p-6 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-primary">
                <img
                  src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.name}</h1>
                <p className="text-muted-foreground mb-3">{user.department}, Year {user.year}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {user.interests.map(interest => (
                    <span
                      key={interest}
                      className={`event-badge event-badge-${interest}`}
                    >
                      {categoryEmojis[interest]} {interest}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={logout}
                  className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm font-medium hover:bg-destructive/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          
          {/* Events Attended */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Events Attended</h2>
            
            {attendedEvents.length === 0 ? (
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground mb-2">You haven't attended any events yet</p>
                <Link to="/events" className="text-primary hover:underline">
                  Browse events to attend
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendedEvents.map(event => (
                  <EventCard key={event.id} event={event} showRsvp={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
