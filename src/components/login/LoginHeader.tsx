
import React from 'react';

const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      {/* Show logo on mobile */}
      <div className="md:hidden mb-8">
        <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center">
          <span className="text-3xl font-bold">H</span>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-fade-in">
        HedWig
      </h1>
      <p className="text-muted-foreground">
        Sign in to access your campus events
      </p>
    </div>
  );
};

export default LoginHeader;
