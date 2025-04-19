
import React, { useState } from 'react';
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

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, rsvpToEvent, cancelRsvp, addEventComment } = useEvents();
  const { user } = useAuth();
  
  const [comment, setComment] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  
  // Get event or redirect if not found
  const event = getEvent(id || '');
  if (!event) {
    navigate('/events');
    return null;
  }
  
  const isUserAttending = user ? event.attendees.includes(user.id) : false;
  
  const handleRsvp = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isUserAttending) {
      cancelRsvp(event.id, user.id);
    } else {
      rsvpToEvent(event.id, user.id);
    }
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    
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
    // In a real app, we would fetch attendee details from the backend
    // For demo, we'll just use mock data
    const mockAttendees = [
      {
        id: '1',
        name: 'Jane Smith',
        email: 'jane@university.edu',
        department: 'Computer Science',
        year: '3',
        interests: ['tech', 'career', 'seminar'] as any[],
        eventsAttended: ['1', '3', '5']
      },
      {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike@university.edu',
        department: 'Business Administration',
        year: '2',
        interests: ['sports', 'social', 'cultural'] as any[],
        eventsAttended: ['2', '4']
      }
    ].filter(a => event.attendees.includes(a.id));
    
    exportAttendanceListCSV(event, mockAttendees as any);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className={`event-badge event-badge-${event.category}`}>
              {categoryEmojis[event.category]} {categoryNames[event.category]}
            </span>
            <span>•</span>
            <span className="text-muted-foreground">Organized by {event.organizerName}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.name}</h1>
          
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
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-foreground/90 whitespace-pre-line">{event.description}</p>
            </div>
            
            {/* Event Media Gallery */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Event Gallery</h2>
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
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center text-lg font-medium">
                      {user.name.charAt(0)}
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
            <div className="glass-card p-6 sticky top-20">
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
                className={`w-full py-3 rounded-xl font-medium mb-4 ${
                  isUserAttending
                    ? 'bg-accent/10 text-accent hover:bg-accent/20'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isUserAttending ? 'Cancel RSVP' : 'RSVP to Event'}
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={toggleQrCode}
                  className="flex-1 py-2 rounded-xl font-medium bg-secondary/10 text-secondary hover:bg-secondary/20"
                >
                  {showQrCode ? 'Hide QR Code' : 'Show QR Code'}
                </button>
                
                <button
                  className="flex items-center justify-center p-2 rounded-xl bg-muted/30 hover:bg-muted/50"
                  aria-label="Share Event"
                >
                  <Share2 className="h-5 w-5" />
                </button>
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

export default EventDetail;
