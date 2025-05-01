
import React from 'react';

interface EventDescriptionProps {
  description: string;
}

const EventDescription: React.FC<EventDescriptionProps> = ({ description }) => {
  return (
    <div className="gradient-card p-6">
      <h2 className="text-xl font-semibold mb-4">About This Event</h2>
      <p className="text-foreground/90 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default EventDescription;
