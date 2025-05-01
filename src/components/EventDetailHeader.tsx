
import React from 'react';
import { categoryEmojis, categoryNames } from '@/types';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import ShareButtons from '@/components/ShareButtons';
import { Event } from '@/types';

interface EventDetailHeaderProps {
  event: Event;
}

const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({ event }) => {
  return (
    <div className="mb-8 relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-event-pattern bg-cover bg-center opacity-10 z-0"></div>
      <div className="gradient-card p-8 relative z-10">
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className={`event-badge event-badge-${event.category}`}>
            {categoryEmojis[event.category]} {categoryNames[event.category]}
          </span>
          <span>•</span>
          <span className="text-muted-foreground">Organized by {event.organizerName}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{event.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-5 w-5 mr-2" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{event.venue}</span>
          </div>
        </div>
        
        {/* Share buttons */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Share:</span>
            <ShareButtons 
              title={event.name}
              text={`Check out this event: ${event.name} at ${event.venue} on ${formatDate(event.date)}`}
              url={window.location.href}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailHeader;
