
export type EventCategory = 
  | 'tech'
  | 'cultural'
  | 'seminar'
  | 'sports'
  | 'social'
  | 'career'
  | 'other';

export type UserInterest = EventCategory;

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  interests: UserInterest[];
  eventsAttended: string[];
  profileImageUrl?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  date: string; // ISO string
  time: string;
  venue: string;
  organizerId: string;
  organizerName: string;
  imageUrl?: string;
  attendees: string[]; // user IDs
  comments: Comment[];
  ratings: Rating[];
  media: Media[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string; // ISO string
}

export interface Rating {
  userId: string;
  stars: number; // 1-5
  comment?: string;
}

export interface Media {
  id: string;
  type: 'image' | 'video';
  url: string;
  uploadedBy: string;
  timestamp: string; // ISO string
  reactions: Reaction[];
  comments: Comment[];
}

export interface Reaction {
  userId: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'event' | 'reminder' | 'comment' | 'rating' | 'media' | 'system';
  isRead: boolean;
  timestamp: string; // ISO string
  eventId?: string;
  mediaId?: string;
}

export interface CategoryEmoji {
  [key: string]: string;
}

export const categoryEmojis: CategoryEmoji = {
  tech: '💻',
  cultural: '🎭',
  seminar: '🎓',
  sports: '🏆',
  social: '🎉',
  career: '💼',
  other: '📌'
};

export const categoryNames: Record<EventCategory, string> = {
  tech: 'Technology',
  cultural: 'Cultural',
  seminar: 'Seminar',
  sports: 'Sports',
  social: 'Social',
  career: 'Career',
  other: 'Other'
};
