
import React from 'react';
import RegisterHeader from '@/components/register/RegisterHeader';
import RegisterForm from '@/components/register/RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterHeader />
        
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
