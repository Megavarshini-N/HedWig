import React, { useState } from 'react';
import { Event, Rating } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Star } from 'lucide-react';

interface EventFeedbackProps {
  event: Event;
}

const EventFeedback: React.FC<EventFeedbackProps> = ({ event }) => {
  const { user } = useAuth();
  const { addEventRating } = useEvents();
  
  // Find user's existing rating if any
  const userRating = user ? event.ratings.find(r => r.userId === user.id) : undefined;
  
  const [rating, setRating] = useState<number>(userRating?.stars || 0);
  const [comment, setComment] = useState<string>(userRating?.comment || '');
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(!!userRating);
  
  // Calculate average rating
  const avgRating = event.ratings.length 
    ? (event.ratings.reduce((sum, r) => sum + r.stars, 0) / event.ratings.length).toFixed(1) 
    : '0.0';
  
  // Star labels
  const starLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  
  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };
  
  const handleMouseEnter = (starValue: number) => {
    setHoveredStar(starValue);
  };
  
  const handleMouseLeave = () => {
    setHoveredStar(0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || rating === 0) return;
    
    addEventRating(event.id, {
      userId: user.id,
      stars: rating,
      comment: comment.trim() || undefined
    });
    
    setSubmitted(true);
  };
  
  const handleEdit = () => {
    setSubmitted(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Event Feedback</h3>
          <p className="text-muted-foreground text-sm">
            {event.ratings.length} {event.ratings.length === 1 ? 'rating' : 'ratings'}
          </p>
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold mr-2">{avgRating}</div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  parseFloat(avgRating) >= star
                    ? 'text-yellow-400 fill-yellow-400'
                    : parseFloat(avgRating) >= star - 0.5
                    ? 'text-yellow-400 fill-yellow-400/50'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* User Rating Form */}
      {user ? (
        submitted ? (
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Your Rating</h4>
              <button
                onClick={handleEdit}
                className="text-sm text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    rating >= star
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium">
                {rating > 0 ? starLabels[rating - 1] : ''}
              </span>
            </div>
            
            {comment && (
              <div className="mt-2">
                <p className="text-sm">{comment}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-4 border border-border">
            <h4 className="font-medium mb-3">Rate this event</h4>
            
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleMouseEnter(star)}
                  onMouseLeave={handleMouseLeave}
                  className="mr-1 focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      (hoveredStar || rating) >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-medium min-w-20">
                {hoveredStar > 0
                  ? starLabels[hoveredStar - 1]
                  : rating > 0
                  ? starLabels[rating - 1]
                  : ''}
              </span>
            </div>
            
            <div className="mb-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (optional)"
                className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-24 resize-none"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={rating === 0}
                className="btn-primary disabled:opacity-50"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )
      ) : (
        <div className="bg-muted/30 rounded-xl p-4 text-center">
          <p className="text-muted-foreground">
            Sign in to leave your feedback for this event
          </p>
        </div>
      )}
      
      {/* Other Users' Ratings */}
      <div className="space-y-4">
        <h4 className="font-medium">Feedback from attendees</h4>
        
        {event.ratings.filter(r => !user || r.userId !== user.id).length === 0 ? (
          <p className="text-muted-foreground text-sm">No feedback yet</p>
        ) : (
          event.ratings
            .filter(r => !user || r.userId !== user.id)
            .map((rating, index) => (
              <div key={`${rating.userId}-${index}`} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        rating.stars >= star
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs font-medium">
                    {starLabels[rating.stars - 1]}
                  </span>
                </div>
                
                {rating.comment && (
                  <div className="mt-2">
                    <p className="text-sm">{rating.comment}</p>
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default EventFeedback;
