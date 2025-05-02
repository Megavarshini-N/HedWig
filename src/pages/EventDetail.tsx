
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { EventQRCode } from '@/utils/qrUtils';
import { formatDate, getCountdownString } from '@/utils/dateUtils';
import { categoryEmojis, categoryNames } from '@/types';
import EventGallery from '@/components/EventGallery';
import EventFeedback from '@/components/EventFeedback';
import { Calendar, Clock, Download, MapPin, MessageCircle, Share2, Users } from 'lucide-react';
import { exportAttendanceListCSV } from '@/utils/exportUtils';
import { Loader, SkeletonLoader } from '@/components/ui/loader';
import ShareButtons from '@/components/ShareButtons';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, rsvpToEvent, cancelRsvp, addEventComment } = useEvents();
  const { user } = useAuth();
  
  const [comment, setComment] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
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
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim() || !event) return;
    
    addEventComment(event.id, {
      userId: user.id,
      userName: user.name,
      text: comment.trim()
    });
    
    setComment('');
  };
  
  const toggleQrCode = () => {
    setShowQrCode(!showQrCode);
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
        {/* Event Header with Background Image */}
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
            
            {/* Share buttons in header */}
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
            <div className="gradient-card p-6">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-foreground/90 whitespace-pre-line">{event.description}</p>
            </div>
            
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
            <div>
              <h2 className="text-xl font-semibold mb-4">Discussion</h2>
              
              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-lg font-medium">
                      {user.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this event..."
                        className="w-full rounded-md border border-border bg-background px-3 py-2 min-h-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={!comment.trim()}
                          className="btn-primary disabled:opacity-50"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-muted/30 rounded-xl p-4 text-center mb-6">
                  <p className="text-muted-foreground">
                    <a href="/login" className="text-primary hover:underline">Sign in</a> to join the discussion
                  </p>
                </div>
              )}
              
              {/* Comment List */}
              <div className="space-y-6">
                {event.comments.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                    <p className="text-muted-foreground">Be the first to comment</p>
                  </div>
                ) : (
                  event.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center text-lg font-medium">
                        {comment.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline">
                          <span className="font-medium">{comment.userName}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - RSVP & Event Details */}
          <div className="space-y-6">
            {/* Countdown & RSVP */}
            <div className="gradient-card-teal p-6 sticky top-20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">
                  Starts In
                </span>
                <span className="bg-accent/10 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {getCountdownString(event.date, event.time)}
                </span>
              </div>
              
              <div className="flex items-center text-muted-foreground mb-6">
                <Users className="h-5 w-5 mr-2" />
                <span>{event.attendees.length} people going</span>
              </div>
              
              <button
                onClick={handleRsvp}
                disabled={isRsvping}
                className={`w-full py-3 rounded-xl font-medium mb-4 transition-colors ${
                  isRsvping ? 'bg-muted text-muted-foreground' :
                  isUserAttending
                    ? 'bg-accent/10 text-accent hover:bg-accent/20'
                    : 'bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isRsvping ? 'Processing...' : isUserAttending ? 'Cancel RSVP' : 'RSVP to Event'}
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={toggleQrCode}
                  className="flex-1 py-2 rounded-xl font-medium bg-secondary/10 text-secondary hover:bg-secondary/20"
                >
                  {showQrCode ? 'Hide QR Code' : 'Show QR Code'}
                </button>
                
                <div className="flex items-center justify-center p-2 rounded-xl bg-muted/30 hover:bg-muted/50">
                  <ShareButtons 
                    title={event.name}
                    text={`Check out this event: ${event.name}`}
                    url={window.location.href}
                  />
                </div>
              </div>
              
              {/* QR Code */}
              {showQrCode && (
                <div className="mt-4 p-4 bg-white rounded-xl flex flex-col items-center">
                  <EventQRCode eventId={event.id} userId={user?.id} className="mb-2" />
                  <p className="text-sm text-center text-black">Scan to mark attendance</p>
                </div>
              )}
              
              {/* Organizer Actions */}
              {user && user.id === event.organizerId && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">Organizer Actions</h3>
                  <button
                    onClick={handleExportAttendance}
                    className="w-full py-2 rounded-xl font-medium bg-muted/30 hover:bg-muted/50 flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Attendance List
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const EventDetailSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="mb-8 gradient-card p-8">
        <div className="h-4 w-20 skeleton rounded-full mb-2" />
        <div className="h-8 w-2/3 skeleton rounded-md mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 w-36 skeleton rounded-md" />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Skeleton */}
          <div className="rounded-xl overflow-hidden h-80 skeleton" />
          
          {/* Description Skeleton */}
          <div className="glass-card p-6">
            <div className="h-6 w-40 skeleton rounded-md mb-4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-full skeleton rounded-md" />
              ))}
            </div>
          </div>
          
          {/* Gallery Skeleton */}
          <div>
            <div className="h-6 w-40 skeleton rounded-md mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 skeleton rounded-lg" />
              ))}
            </div>
          </div>
          
          {/* Comments Skeleton */}
          <div>
            <div className="h-6 w-40 skeleton rounded-md mb-4" />
            <div className="h-24 skeleton rounded-lg mb-6" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-10 w-10 rounded-full skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 skeleton rounded-md" />
                    <div className="h-3 w-full skeleton rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column Skeleton */}
        <div>
          <div className="gradient-card-teal p-6 sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <div className="h-5 w-20 skeleton rounded-md" />
              <div className="h-5 w-16 skeleton rounded-full" />
            </div>
            <div className="h-5 w-36 skeleton rounded-md mb-6" />
            <div className="h-10 w-full skeleton rounded-xl mb-4" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 skeleton rounded-xl" />
              <div className="h-10 w-10 skeleton rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
