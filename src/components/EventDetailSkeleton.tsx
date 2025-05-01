
import React from 'react';

const EventDetailSkeleton: React.FC = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="mb-8 gradient-card p-8">
        <div className="h-4 w-20 skeleton rounded-full mb-2" />
        <div className="h-8 w-2/3 skeleton rounded-md mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 w-36 skeleton rounded-md" />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Skeleton */}
          <div className="rounded-xl overflow-hidden h-80 skeleton" />
          
          {/* Description Skeleton */}
          <div className="glass-card p-6">
            <div className="h-6 w-40 skeleton rounded-md mb-4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-full skeleton rounded-md" />
              ))}
            </div>
          </div>
          
          {/* Gallery Skeleton */}
          <div>
            <div className="h-6 w-40 skeleton rounded-md mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 skeleton rounded-lg" />
              ))}
            </div>
          </div>
          
          {/* Comments Skeleton */}
          <div>
            <div className="h-6 w-40 skeleton rounded-md mb-4" />
            <div className="h-24 skeleton rounded-lg mb-6" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-10 w-10 rounded-full skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 skeleton rounded-md" />
                    <div className="h-3 w-full skeleton rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column Skeleton */}
        <div>
          <div className="gradient-card-teal p-6 sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <div className="h-5 w-20 skeleton rounded-md" />
              <div className="h-5 w-16 skeleton rounded-full" />
            </div>
            <div className="h-5 w-36 skeleton rounded-md mb-6" />
            <div className="h-10 w-full skeleton rounded-xl mb-4" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 skeleton rounded-xl" />
              <div className="h-10 w-10 skeleton rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailSkeleton;
