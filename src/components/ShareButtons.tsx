
import React from 'react';
import { Share, Facebook, Twitter, Instagram } from 'lucide-react';

interface ShareButtonsProps {
  eventId: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ eventId, title }) => {
  const shareUrl = `${window.location.origin}/events/${eventId}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    instagram: `https://www.instagram.com/?url=${encodedUrl}` // Note: Instagram doesn't support direct sharing via URL
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-medium text-muted-foreground">
        <Share className="inline-block w-4 h-4 mr-1.5" /> Share Event
      </div>
      <div className="flex gap-2">
        <a 
          href={shareLinks.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="share-button share-button-whatsapp"
          aria-label="Share on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/>
            <path d="M13.5 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/>
            <path d="M9 13.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5Z"/>
          </svg>
        </a>
        <a 
          href={shareLinks.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-button bg-[#3b5998] text-white"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </a>
        <a 
          href={shareLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-button bg-[#1DA1F2] text-white"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </a>
        <a 
          href={shareLinks.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-button share-button-instagram"
          aria-label="Share on Instagram"
        >
          <Instagram className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default ShareButtons;
