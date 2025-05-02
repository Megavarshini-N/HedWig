
import React from 'react';
import { UserInterest } from '@/types';

interface InterestSelectorProps {
  selectedInterests: UserInterest[];
  toggleInterest: (interest: UserInterest) => void;
  interests: UserInterest[];
}

const InterestSelector: React.FC<InterestSelectorProps> = ({
  selectedInterests,
  toggleInterest,
  interests
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">
        Interests (select at least one)
      </label>
      <div className="flex flex-wrap gap-2">
        {interests.map(interest => (
          <button
            key={interest}
            type="button"
            onClick={() => toggleInterest(interest)}
            className={`px-3 py-1 rounded-full text-xs capitalize ${
              selectedInterests.includes(interest)
                ? `bg-event-${interest} text-white`
                : 'bg-accent/10 hover:bg-accent/20'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InterestSelector;
