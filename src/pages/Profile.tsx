
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { categoryEmojis } from '@/types';
import { Link, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Calendar, MapPin, Rocket, User, GraduationCap } from 'lucide-react';

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
    <div className="min-h-screen bg-background bg-[url('https://images.unsplash.com/photo-1462536943532-57a629f6cc60?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHN0dWRlbnQlMjBibHVycmVkJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')] bg-fixed bg-cover bg-no-repeat bg-center before:content-[''] before:absolute before:inset-0 before:bg-background/90 before:backdrop-blur-sm before:z-0">
      <Header />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card p-6 rounded-xl mb-8 border-t-4 border-primary animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative group">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/20 group-hover:ring-primary transition-all duration-300">
                  <AvatarImage
                    src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <User className="h-4 w-4" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.name}</h1>
                    <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 mb-3">
                      <GraduationCap className="h-4 w-4" />
                      <span>{user.department}, Year {user.year}</span>
                    </p>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm font-medium hover:bg-destructive/20 transition-colors mt-2 md:mt-0"
                  >
                    Sign Out
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  {user.interests.map(interest => (
                    <span
                      key={interest}
                      className={`event-badge event-badge-${interest}`}
                    >
                      {categoryEmojis[interest]} {interest}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
                  <div className="glass-card p-3 rounded-lg hover:bg-accent/10 transition-colors">
                    <Award className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                    <p className="text-sm text-muted-foreground">Achievement Points</p>
                    <p className="font-semibold">{user.eventsAttended.length * 25}</p>
                  </div>
                  <div className="glass-card p-3 rounded-lg hover:bg-accent/10 transition-colors">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Events Attended</p>
                    <p className="font-semibold">{user.eventsAttended.length}</p>
                  </div>
                  <div className="glass-card p-3 rounded-lg hover:bg-accent/10 transition-colors">
                    <Rocket className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                    <p className="text-sm text-muted-foreground">Interests</p>
                    <p className="font-semibold">{user.interests.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Events Attended */}
          <div className="mb-8 animate-slide-in">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Events Attended
            </h2>
            
            {attendedEvents.length === 0 ? (
              <div className="glass-card p-6 text-center bg-[url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3')] bg-cover bg-center relative overflow-hidden">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-60" />
                  <p className="text-muted-foreground mb-3">You haven't attended any events yet</p>
                  <Link to="/events" className="btn-primary hover:shadow-lg transition-all duration-300">
                    Browse events to attend
                  </Link>
                </div>
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
