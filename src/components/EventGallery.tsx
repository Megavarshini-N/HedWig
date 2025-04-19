
import React, { useState } from 'react';
import { Media, Comment } from '@/types';
import { getRelativeTime } from '@/utils/dateUtils';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Heart, MessageCircle, X } from 'lucide-react';

interface EventGalleryProps {
  eventId: string;
  media: Media[];
}

const EventGallery: React.FC<EventGalleryProps> = ({ eventId, media }) => {
  const { user } = useAuth();
  const { addMediaComment, addMediaReaction } = useEvents();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [comment, setComment] = useState('');

  if (media.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
        <p className="text-muted-foreground">No media has been uploaded for this event yet.</p>
      </div>
    );
  }

  const handleReaction = (mediaId: string, type: 'like' | 'love' | 'wow' | 'haha' | 'sad') => {
    if (!user) return;
    addMediaReaction(eventId, mediaId, user.id, type);
  };

  const handleCommentSubmit = (e: React.FormEvent, mediaId: string) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    addMediaComment(eventId, mediaId, {
      userId: user.id,
      userName: user.name,
      text: comment.trim()
    });

    setComment('');
  };

  const openMedia = (media: Media) => {
    setSelectedMedia(media);
  };

  const closeMedia = () => {
    setSelectedMedia(null);
  };

  // Count total reactions
  const countReactions = (reactions: Media['reactions']) => {
    return reactions.length;
  };

  // Check if user has reacted
  const hasUserReacted = (reactions: Media['reactions']) => {
    if (!user) return false;
    return reactions.some(reaction => reaction.userId === user.id);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <div 
            key={item.id} 
            className="cursor-pointer rounded-xl overflow-hidden border border-border relative group"
            onClick={() => openMedia(item)}
          >
            {item.type === 'image' ? (
              <img 
                src={item.url} 
                alt="Event media" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <video 
                src={item.url} 
                className="w-full h-64 object-cover" 
                controls={false}
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs">
                    {getRelativeTime(item.timestamp)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Heart 
                      className={`h-4 w-4 mr-1 ${
                        hasUserReacted(item.reactions) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                    <span className="text-xs">{countReactions(item.reactions)}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">{item.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative bg-card rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={closeMedia}
                className="bg-black/50 text-white rounded-full p-1 backdrop-blur-sm"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
              {selectedMedia.type === 'image' ? (
                <img 
                  src={selectedMedia.url} 
                  alt="Event media" 
                  className="max-h-[60vh] max-w-full object-contain"
                />
              ) : (
                <video 
                  src={selectedMedia.url} 
                  className="max-h-[60vh] max-w-full" 
                  controls
                  autoPlay
                />
              )}
            </div>
            
            <div className="p-4 border-t border-border">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  {getRelativeTime(selectedMedia.timestamp)}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleReaction(selectedMedia.id, 'like')}
                    className={`p-2 rounded-full transition-colors ${
                      user && hasUserReacted(selectedMedia.reactions)
                        ? 'bg-red-100 text-red-500 dark:bg-red-900/20'
                        : 'hover:bg-accent/10'
                    }`}
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        user && hasUserReacted(selectedMedia.reactions) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Comments</h4>
                <div className="max-h-40 overflow-y-auto space-y-3">
                  {selectedMedia.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  ) : (
                    selectedMedia.comments.map((comment: Comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                          {comment.userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline">
                            <span className="font-medium text-sm">{comment.userName}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {getRelativeTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {user && (
                <form onSubmit={(e) => handleCommentSubmit(e, selectedMedia.id)} className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    Post
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventGallery;
