
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="text-2xl font-bold text-portfolio-dark">
            Portfolio<span className="text-portfolio-primary">AI</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-portfolio-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-portfolio-primary transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-gray-600 hover:text-portfolio-primary transition-colors">
            Testimonials
          </a>
          <Button variant="outline" className="border-portfolio-primary text-portfolio-primary hover:bg-portfolio-light">
            Log In
          </Button>
          <Button className="bg-portfolio-primary hover:bg-portfolio-secondary text-white">
            Get Early Access
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-gray-600 hover:text-portfolio-primary focus:outline-none"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 p-4 space-y-4">
          <a href="#features" className="block text-gray-600 hover:text-portfolio-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="block text-gray-600 hover:text-portfolio-primary transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="block text-gray-600 hover:text-portfolio-primary transition-colors">
            Testimonials
          </a>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="border-portfolio-primary text-portfolio-primary hover:bg-portfolio-light">
              Log In
            </Button>
            <Button className="bg-portfolio-primary hover:bg-portfolio-secondary text-white">
              Get Early Access
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
