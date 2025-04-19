
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Event, EventCategory, Comment, Rating, Media } from '@/types';

interface EventContextType {
  events: Event[];
  getEvent: (id: string) => Event | undefined;
  getEventsByCategory: (category: EventCategory) => Event[];
  getUpcomingEvents: () => Event[];
  getEventsHappeningToday: () => Event[];
  getPopularEvents: () => Event[];
  addEventComment: (eventId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  addEventRating: (eventId: string, rating: Rating) => void;
  addEventMedia: (eventId: string, media: Omit<Media, 'id' | 'timestamp' | 'reactions' | 'comments'>) => void;
  rsvpToEvent: (eventId: string, userId: string) => void;
  cancelRsvp: (eventId: string, userId: string) => void;
  addMediaComment: (eventId: string, mediaId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  addMediaReaction: (eventId: string, mediaId: string, userId: string, reactionType: 'like' | 'love' | 'wow' | 'haha' | 'sad') => void;
  getUserRsvpEvents: (userId: string) => Event[];
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Tech Hackathon 2025',
    description: 'Join us for a 24-hour coding marathon where students will work in teams to develop innovative solutions to real-world problems. Prizes for the top three teams! Food and drinks provided.',
    category: 'tech',
    date: '2025-05-15',
    time: '10:00 AM - 10:00 AM (next day)',
    venue: 'Engineering Building, Room 301',
    organizerId: 'org1',
    organizerName: 'Computer Science Club',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: ['1'],
    comments: [
      {
        id: 'c1',
        userId: '2',
        userName: 'Mike Johnson',
        text: 'Looking forward to this! Will there be any workshops beforehand?',
        timestamp: '2025-04-20T14:30:00Z'
      }
    ],
    ratings: [],
    media: []
  },
  {
    id: '2',
    name: 'Spring Concert Series',
    description: 'Our annual Spring Concert featuring performances from student bands, solo artists, and the university orchestra. A celebration of music across genres!',
    category: 'cultural',
    date: '2025-04-28',
    time: '7:00 PM - 10:00 PM',
    venue: 'University Amphitheater',
    organizerId: 'org2',
    organizerName: 'Student Activities Board',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: ['2'],
    comments: [],
    ratings: [],
    media: []
  },
  {
    id: '3',
    name: 'AI and Future of Work Seminar',
    description: 'A special seminar featuring industry experts discussing how artificial intelligence is transforming the job market and what skills students need to develop for the future.',
    category: 'seminar',
    date: '2025-04-19',
    time: '2:00 PM - 4:00 PM',
    venue: 'Business School Auditorium',
    organizerId: 'org3',
    organizerName: 'Career Development Center',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: ['1'],
    comments: [],
    ratings: [
      {
        userId: '1',
        stars: 5,
        comment: 'Very informative and eye-opening!'
      }
    ],
    media: []
  },
  {
    id: '4',
    name: 'Intramural Basketball Tournament',
    description: 'Annual basketball tournament between departments. Form your team and compete for the championship trophy! All skill levels welcome.',
    category: 'sports',
    date: '2025-05-02',
    time: '1:00 PM - 6:00 PM',
    venue: 'University Sports Complex',
    organizerId: 'org4',
    organizerName: 'Campus Recreation',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: ['2'],
    comments: [],
    ratings: [],
    media: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        uploadedBy: 'org4',
        timestamp: '2024-04-10T16:30:00Z',
        reactions: [
          {
            userId: '2',
            type: 'like'
          }
        ],
        comments: []
      }
    ]
  },
  {
    id: '5',
    name: 'Networking Mixer',
    description: 'Connect with alumni and industry professionals in a casual setting. Great opportunity to build your professional network and explore career opportunities.',
    category: 'career',
    date: '2025-04-21',
    time: '6:00 PM - 8:00 PM',
    venue: 'Student Union Ballroom',
    organizerId: 'org3',
    organizerName: 'Career Development Center',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: ['1'],
    comments: [],
    ratings: [],
    media: []
  },
  {
    id: '6',
    name: 'Earth Day Celebration',
    description: 'Join us for a day of environmental awareness activities, including a campus clean-up, tree planting, and sustainability workshops.',
    category: 'social',
    date: '2025-04-22',
    time: '10:00 AM - 3:00 PM',
    venue: 'Campus Quad',
    organizerId: 'org5',
    organizerName: 'Environmental Club',
    imageUrl: 'https://images.unsplash.com/photo-1534839561006-2488ba8ba6a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: [],
    comments: [],
    ratings: [],
    media: []
  },
  {
    id: '7',
    name: 'Game Night',
    description: 'Take a break from studying and join us for board games, video games, and snacks! A fun night of friendly competition and socializing.',
    category: 'social',
    date: '2025-04-19', // Today for demo purposes
    time: '7:00 PM - 10:00 PM',
    venue: 'Student Center Lounge',
    organizerId: 'org6',
    organizerName: 'Student Government',
    imageUrl: 'https://images.unsplash.com/photo-1609366031591-e5b3663b51e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: [],
    comments: [],
    ratings: [],
    media: []
  },
  {
    id: '8',
    name: 'Research Symposium',
    description: 'Undergraduate and graduate students present their research projects. Great opportunity to learn about cutting-edge research happening on campus.',
    category: 'seminar',
    date: '2025-04-25',
    time: '9:00 AM - 4:00 PM',
    venue: 'Science Center',
    organizerId: 'org7',
    organizerName: 'Office of Research',
    imageUrl: 'https://images.unsplash.com/photo-1551818176-60579e574b91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: [],
    comments: [],
    ratings: [],
    media: []
  }
];

const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  
  // Get a single event by ID
  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };
  
  // Get events by category
  const getEventsByCategory = (category: EventCategory) => {
    return events.filter(event => event.category === category);
  };
  
  // Get upcoming events (future dates)
  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter(event => event.date > today)
      .sort((a, b) => a.date.localeCompare(b.date));
  };
  
  // Get events happening today
  const getEventsHappeningToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date === today);
  };
  
  // Get popular events (most attendees)
  const getPopularEvents = () => {
    return [...events]
      .sort((a, b) => b.attendees.length - a.attendees.length)
      .slice(0, 5);
  };
  
  // Add a comment to an event
  const addEventComment = (eventId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            comments: [
              ...event.comments,
              {
                ...comment,
                id: `c${event.comments.length + 1}`,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return event;
      })
    );
  };
  
  // Add a rating to an event
  const addEventRating = (eventId: string, rating: Rating) => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          // Check if user already rated
          const userAlreadyRated = event.ratings.findIndex(r => r.userId === rating.userId);
          
          if (userAlreadyRated >= 0) {
            // Update existing rating
            const updatedRatings = [...event.ratings];
            updatedRatings[userAlreadyRated] = rating;
            return { ...event, ratings: updatedRatings };
          } else {
            // Add new rating
            return {
              ...event,
              ratings: [...event.ratings, rating]
            };
          }
        }
        return event;
      })
    );
  };
  
  // Add media to an event
  const addEventMedia = (eventId: string, media: Omit<Media, 'id' | 'timestamp' | 'reactions' | 'comments'>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            media: [
              ...event.media,
              {
                ...media,
                id: `m${event.media.length + 1}`,
                timestamp: new Date().toISOString(),
                reactions: [],
                comments: []
              }
            ]
          };
        }
        return event;
      })
    );
  };
  
  // RSVP to an event
  const rsvpToEvent = (eventId: string, userId: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId && !event.attendees.includes(userId)) {
          return {
            ...event,
            attendees: [...event.attendees, userId]
          };
        }
        return event;
      })
    );
  };
  
  // Cancel RSVP
  const cancelRsvp = (eventId: string, userId: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: event.attendees.filter(id => id !== userId)
          };
        }
        return event;
      })
    );
  };
  
  // Add a comment to media
  const addMediaComment = (eventId: string, mediaId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            media: event.media.map(m => {
              if (m.id === mediaId) {
                return {
                  ...m,
                  comments: [
                    ...m.comments,
                    {
                      ...comment,
                      id: `mc${m.comments.length + 1}`,
                      timestamp: new Date().toISOString()
                    }
                  ]
                };
              }
              return m;
            })
          };
        }
        return event;
      })
    );
  };
  
  // Add a reaction to media
  const addMediaReaction = (eventId: string, mediaId: string, userId: string, reactionType: 'like' | 'love' | 'wow' | 'haha' | 'sad') => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            media: event.media.map(m => {
              if (m.id === mediaId) {
                // Check if user already reacted
                const existingReactionIndex = m.reactions.findIndex(r => r.userId === userId);
                
                if (existingReactionIndex >= 0) {
                  // Update existing reaction
                  const updatedReactions = [...m.reactions];
                  updatedReactions[existingReactionIndex] = { userId, type: reactionType };
                  return { ...m, reactions: updatedReactions };
                } else {
                  // Add new reaction
                  return {
                    ...m,
                    reactions: [...m.reactions, { userId, type: reactionType }]
                  };
                }
              }
              return m;
            })
          };
        }
        return event;
      })
    );
  };
  
  // Get events that a user has RSVP'd to
  const getUserRsvpEvents = (userId: string) => {
    return events.filter(event => event.attendees.includes(userId));
  };
  
  const value = {
    events,
    getEvent,
    getEventsByCategory,
    getUpcomingEvents,
    getEventsHappeningToday,
    getPopularEvents,
    addEventComment,
    addEventRating,
    addEventMedia,
    rsvpToEvent,
    cancelRsvp,
    addMediaComment,
    addMediaReaction,
    getUserRsvpEvents
  };
  
  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
