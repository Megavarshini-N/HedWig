
import React from 'react';

const DemoAccounts: React.FC = () => {
  return (
    <div className="mt-8 text-center text-sm text-muted-foreground p-4 bg-background/50 rounded-lg backdrop-blur-sm border border-border/30">
      <p className="font-medium mb-2">Demo accounts:</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center p-2 rounded-lg bg-background/80 hover:bg-background transition-colors">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            alt="Jane"
            className="w-10 h-10 rounded-full object-cover mb-1 ring-2 ring-primary/20"
          />
          <p className="text-xs font-medium">jane@skasc.ac.in</p>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-background/80 hover:bg-background transition-colors">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            alt="Mike"
            className="w-10 h-10 rounded-full object-cover mb-1 ring-2 ring-primary/20"
          />
          <p className="text-xs font-medium">mike@skasc.ac.in</p>
        </div>
      </div>
      <p className="mt-4">Any password will work for demo purposes</p>
    </div>
  );
};

export default DemoAccounts;
