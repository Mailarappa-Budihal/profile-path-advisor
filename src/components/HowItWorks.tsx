
import React from 'react';

const steps = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Upload your résumé or use our guided questionnaire to build your professional profile.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )
  },
  {
    id: 2,
    title: "AI Generates Your Assets",
    description: "Our AI analyzes your information to create a tailored portfolio, résumé, and cover letters.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
        <path d="M12 8v1"></path>
        <path d="M12 15v1"></path>
        <path d="M16 12h-1"></path>
        <path d="M9 12H8"></path>
        <path d="M15.2 8.8l-.7.7"></path>
        <path d="M9.5 14.5l-.7.7"></path>
        <path d="M15.2 15.2l-.7-.7"></path>
        <path d="M9.5 9.5l-.7-.7"></path>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      </svg>
    )
  },
  {
    id: 3,
    title: "Practice and Prepare",
    description: "Use the AI mock interviewer and career coaching tools to get ready for job applications.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
        <circle cx="17" cy="7" r="5"></circle>
      </svg>
    )
  },
  {
    id: 4,
    title: "Apply with Confidence",
    description: "Receive targeted job alerts and apply with your professionally crafted materials.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    )
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Four simple steps to transform your career prospects and land your dream job.
          </p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-portfolio-primary mb-6">
                  <div className="text-portfolio-primary">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
                <div className="md:hidden mt-6 w-px h-8 bg-gray-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
