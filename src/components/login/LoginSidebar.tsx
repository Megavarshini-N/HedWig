
import React from 'react';

const LoginSidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/80 to-secondary/80 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/003b5260-fad2-4ce5-ba11-fe4c86d135c8.png')] bg-cover bg-center opacity-80 mix-blend-overlay"></div>
      <div className="relative z-10 flex flex-col justify-between h-full text-white">
        <div>
          <h1 className="text-5xl font-bold mb-4">HedWig</h1>
          <p className="text-xl opacity-90">Your campus events companion</p>
        </div>
        <div className="space-y-8">
          <div className="glass p-6 rounded-xl backdrop-blur-lg bg-white/10">
            <p className="text-lg font-medium mb-2">✨ Stay Connected</p>
            <p className="opacity-80">Never miss out on important campus events and activities</p>
          </div>
          <div className="glass p-6 rounded-xl backdrop-blur-lg bg-white/10">
            <p className="text-lg font-medium mb-2">🎓 Made for Students</p>
            <p className="opacity-80">Designed specifically for SKASC students to enhance campus life</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-lg"></div>
          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-lg"></div>
          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginSidebar;
