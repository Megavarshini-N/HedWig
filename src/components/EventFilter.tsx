
import React from 'react';
import { EventCategory, categoryEmojis, categoryNames } from '@/types';

interface EventFilterProps {
  selectedCategory: EventCategory | 'all';
  setSelectedCategory: (category: EventCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const categories: (EventCategory | 'all')[] = ['all', 'tech', 'cultural', 'seminar', 'sports', 'social', 'career', 'other'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full h-12 pl-4 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute right-3 top-3.5 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="flex overflow-x-auto pb-2 no-scrollbar">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? category === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : `bg-event-${category} text-white`
                  : 'bg-accent/10 hover:bg-accent/20'
              }`}
            >
              {category !== 'all' && (
                <span className="mr-1">{categoryEmojis[category]}</span>
              )}
              {category === 'all' ? 'All Events' : categoryNames[category]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFilter;
