
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 bg-portfolio-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 animate-slideInLeft">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Supercharge Your Career with <span className="gradient-text">AI-Powered</span> Portfolio Tools
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Create polished portfolios, résumés, and cover letters that get you noticed. 
              PortfolioAI helps entry-level professionals stand out with AI-enhanced career tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-portfolio-primary hover:bg-portfolio-secondary text-white text-lg py-6 px-8">
                Get Early Access
              </Button>
              <Button variant="outline" className="border-portfolio-primary text-portfolio-primary hover:bg-portfolio-light text-lg py-6 px-8">
                How It Works
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 animate-slideInRight">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md mx-auto">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 bg-gray-100 rounded-md px-4 py-1 text-xs text-gray-500 flex-grow text-center">
                    portfolio-builder.ai/your-name
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="h-24 bg-portfolio-light rounded-lg animate-pulse"></div>
                  <div className="flex gap-4">
                    <div className="h-16 w-16 bg-portfolio-light rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-portfolio-light rounded animate-pulse"></div>
                      <div className="h-4 bg-portfolio-light rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-portfolio-light rounded animate-pulse"></div>
                    <div className="h-4 bg-portfolio-light rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-portfolio-light rounded w-4/6 animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-portfolio-light rounded-lg animate-pulse"></div>
                    <div className="h-20 bg-portfolio-light rounded-lg animate-pulse"></div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <div className="px-6 py-2 bg-portfolio-primary text-white rounded-md text-sm">
                    AI Generated Portfolio
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-portfolio-accent opacity-20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-portfolio-primary opacity-20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
