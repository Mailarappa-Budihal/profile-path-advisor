
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-portfolio-dark">
              Portfolio<span className="text-portfolio-primary">AI</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/portfolio-builder">Portfolio</NavLink>
            <NavLink href="/resume-generator">Resume</NavLink>
            <NavLink href="/cover-letter">Cover Letters</NavLink>
            <NavLink href="/mock-interview">Interviews</NavLink>
            <NavLink href="/job-alerts">Job Alerts</NavLink>
            <NavLink href="/career-coaching">Coaching</NavLink>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <span className="mr-4 text-sm text-gray-600">
                {user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
            
            <button onClick={toggleMobileMenu} className="md:hidden">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-white">
          <div className="p-4 space-y-3">
            <MobileNavLink href="/portfolio-builder" onClick={() => setIsMobileMenuOpen(false)}>
              Portfolio
            </MobileNavLink>
            <MobileNavLink href="/resume-generator" onClick={() => setIsMobileMenuOpen(false)}>
              Resume
            </MobileNavLink>
            <MobileNavLink href="/cover-letter" onClick={() => setIsMobileMenuOpen(false)}>
              Cover Letters
            </MobileNavLink>
            <MobileNavLink href="/mock-interview" onClick={() => setIsMobileMenuOpen(false)}>
              Interviews
            </MobileNavLink>
            <MobileNavLink href="/job-alerts" onClick={() => setIsMobileMenuOpen(false)}>
              Job Alerts
            </MobileNavLink>
            <MobileNavLink href="/career-coaching" onClick={() => setIsMobileMenuOpen(false)}>
              Coaching
            </MobileNavLink>
            <div className="pt-3">
              <span className="block text-sm text-gray-600 mb-2">
                {user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut} className="w-full">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      
      <footer className="border-t bg-white p-6">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} PortfolioAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link
      to={href}
      className="text-gray-700 hover:text-portfolio-primary transition-colors"
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ 
  href, 
  children, 
  onClick
}: { 
  href: string; 
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Link
      to={href}
      className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default DashboardLayout;
