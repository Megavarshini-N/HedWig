
import React from 'react';
import LoginSidebar from '@/components/login/LoginSidebar';
import LoginHeader from '@/components/login/LoginHeader';
import LoginForm from '@/components/login/LoginForm';
import DemoAccounts from '@/components/login/DemoAccounts';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch">
      {/* Left Panel - SKASC Campus Image with blue-purple gradient overlay */}
      <LoginSidebar />
      
      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background to-muted/50">
        <div className="w-full max-w-md">
          <LoginHeader />
          
          <div className="glass-card p-8 backdrop-blur-lg border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <LoginForm />
          </div>
          
          <DemoAccounts />
        </div>
      </div>
    </div>
  );
};

export default Login;
