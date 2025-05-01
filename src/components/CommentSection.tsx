
import React, { useState } from 'react';
import { Comment } from '@/types';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    
    onAddComment(comment.trim());
    setComment('');
  };

  return (
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
        {comments.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">Be the first to comment</p>
          </div>
        ) : (
          comments.map(comment => (
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
  );
};

export default CommentSection;
