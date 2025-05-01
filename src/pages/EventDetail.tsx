
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { exportAttendanceListCSV } from '@/utils/exportUtils';
import { Loader } from '@/components/ui/loader';
import EventDetailHeader from '@/components/EventDetailHeader';
import EventDescription from '@/components/EventDescription';
import CommentSection from '@/components/CommentSection';
import EventSidebar from '@/components/EventSidebar';
import EventGallery from '@/components/EventGallery';
import EventFeedback from '@/components/EventFeedback';
import EventDetailSkeleton from '@/components/EventDetailSkeleton';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, rsvpToEvent, cancelRsvp, addEventComment } = useEvents();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRsvping, setIsRsvping] = useState(false);
  
  useEffect(() => {
    // Simulate fetching event data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get event or redirect if not found
  const event = getEvent(id || '');
  if (!event && !isLoading) {
    navigate('/events');
    return null;
  }
  
  const isUserAttending = user && event ? event.attendees.includes(user.id) : false;
  
  const handleRsvp = async () => {
    if (!user || !event) {
      navigate('/login');
      return;
    }
    
    setIsRsvping(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isUserAttending) {
        cancelRsvp(event.id, user.id);
      } else {
        rsvpToEvent(event.id, user.id);
      }
    } finally {
      setIsRsvping(false);
    }
  };
  
  const handleCommentSubmit = (text: string) => {
    if (!user || !text || !event) return;
    
    addEventComment(event.id, {
      userId: user.id,
      userName: user.name,
      text: text
    });
  };
  
  const handleExportAttendance = () => {
    if (!event) return;
    
    // In a real app, we would fetch attendee details from the backend
    // For demo, we'll just use mock data
    const mockAttendees = [
      {
        id: '1',
        name: 'Jane Smith',
        email: 'jane@skasc.ac.in',
        department: 'Computer Science',
        year: '3',
        interests: ['tech', 'career', 'seminar'] as any[],
        eventsAttended: ['1', '3', '5'],
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike@skasc.ac.in',
        department: 'Business Administration',
        year: '2',
        interests: ['sports', 'social', 'cultural'] as any[],
        eventsAttended: ['2', '4'],
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      }
    ].filter(a => event.attendees.includes(a.id));
    
    exportAttendanceListCSV(event, mockAttendees as any);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <EventDetailSkeleton />
        </main>
      </div>
    );
  }
  
  if (!event) return null;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Event Header */}
        <EventDetailHeader event={event} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Image */}
            <div className="rounded-xl overflow-hidden h-80">
              <img 
                src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'} 
                alt={event.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Event Description */}
            <EventDescription description={event.description} />
            
            {/* Event Media Gallery */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Event Gallery</h2>
                {event.media.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Share gallery:</span>
                    <ShareButtons 
                      title={`Photos from ${event.name}`}
                      text={`Check out these photos from ${event.name}`}
                      url={window.location.href}
                    />
                  </div>
                )}
              </div>
              <EventGallery eventId={event.id} media={event.media} />
            </div>
            
            {/* Event Feedback */}
            <div>
              <EventFeedback event={event} />
            </div>
            
            {/* Event Comments */}
            <CommentSection 
              comments={event.comments}
              onAddComment={handleCommentSubmit}
            />
          </div>
          
          {/* Right Column - RSVP & Event Details */}
          <div className="space-y-6">
            <EventSidebar 
              event={event}
              isUserAttending={isUserAttending}
              isRsvping={isRsvping}
              user={user}
              onRsvp={handleRsvp}
              onExportAttendance={handleExportAttendance}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
