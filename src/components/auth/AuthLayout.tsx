
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-portfolio-dark">
            Portfolio<span className="text-portfolio-primary">AI</span>
          </span>
        </Link>
      </header>
      
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>
      
      <footer className="border-t bg-white p-6 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} PortfolioAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
