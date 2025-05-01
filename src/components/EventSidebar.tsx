
import React, { useState } from 'react';
import { Download, Users } from 'lucide-react';
import { EventQRCode } from '@/utils/qrUtils';
import { getCountdownString } from '@/utils/dateUtils';
import ShareButtons from '@/components/ShareButtons';

interface EventSidebarProps {
  event: any; // Using any for simplicity, should be Event type
  isUserAttending: boolean;
  isRsvping: boolean;
  user?: any; // Using any for simplicity, should be User type
  onRsvp: () => void;
  onExportAttendance: () => void;
}

const EventSidebar: React.FC<EventSidebarProps> = ({
  event,
  isUserAttending,
  isRsvping,
  user,
  onRsvp,
  onExportAttendance
}) => {
  const [showQrCode, setShowQrCode] = useState(false);

  const toggleQrCode = () => {
    setShowQrCode(!showQrCode);
  };

  return (
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
        onClick={onRsvp}
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
            onClick={onExportAttendance}
            className="w-full py-2 rounded-xl font-medium bg-muted/30 hover:bg-muted/50 flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Attendance List
          </button>
        </div>
      )}
    </div>
  );
};

export default EventSidebar;
