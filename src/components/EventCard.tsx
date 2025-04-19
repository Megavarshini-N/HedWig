
import React from 'react';
import { Link } from 'react-router-dom';
import { Event, categoryEmojis } from '@/types';
import { formatDate, getDaysRemaining, isToday } from '@/utils/dateUtils';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';

interface EventCardProps {
  event: Event;
  showRsvp?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, showRsvp = true }) => {
  const { user } = useAuth();
  const { rsvpToEvent, cancelRsvp } = useEvents();
  
  const isUserAttending = user ? event.attendees.includes(user.id) : false;
  const daysRemaining = getDaysRemaining(event.date);
  
  const handleRsvp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (isUserAttending) {
      cancelRsvp(event.id, user.id);
    } else {
      rsvpToEvent(event.id, user.id);
    }
  };
  
  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="event-card event-card-hover">
        {/* Event Image */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
          <img
            src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'}
            alt={event.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Category Badge */}
          <div className={`absolute top-3 left-3 event-badge event-badge-${event.category}`}>
            <span className="mr-1">{categoryEmojis[event.category]}</span>
            <span className="capitalize">{event.category}</span>
          </div>
          
          {/* Date Badge for upcoming events */}
          {daysRemaining > 0 && !isToday(event.date) && (
            <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-md">
              {daysRemaining === 1 ? 'Tomorrow' : `${daysRemaining} days`}
            </div>
          )}
          
          {/* Today Badge */}
          {isToday(event.date) && (
            <div className="absolute bottom-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-md animate-pulse-gentle">
              Today
            </div>
          )}
        </div>
        
        {/* Event Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{event.name}</h3>
          
          {/* Event Details */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>{event.attendees.length} attending</span>
            </div>
          </div>
          
          {/* RSVP Button */}
          {showRsvp && (
            <div className="mt-4">
              <button
                onClick={handleRsvp}
                className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isUserAttending
                    ? 'bg-accent/10 text-accent hover:bg-accent/20'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isUserAttending ? 'Cancel RSVP' : 'RSVP'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
