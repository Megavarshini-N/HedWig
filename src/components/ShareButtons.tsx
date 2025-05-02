
import React from 'react';
import { Share, Facebook, Twitter, Instagram, Whatsapp } from 'lucide-react';

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
          <Whatsapp className="h-4 w-4" />
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
