
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Engineer",
    company: "Tech Startup",
    quote: "PortfolioAI helped me transform my academic projects into a professional portfolio that landed me my first tech job. The AI mock interviews were incredibly helpful!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sara Chen",
    role: "UX Designer",
    company: "Design Agency",
    quote: "After switching careers, I needed a way to showcase my skills. The portfolio builder and resume optimization tools helped me stand out in a competitive field.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Data Analyst",
    company: "Finance Company",
    quote: "The job alert engine filtered through hundreds of postings to find the perfect match for my experience level. I got interviews at companies I never thought would consider me!",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how PortfolioAI has helped early-career professionals land their dream jobs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border border-gray-100 shadow-lg overflow-hidden bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-portfolio-primary">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <svg className="h-6 w-6 text-portfolio-accent opacity-40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 italic">{testimonial.quote}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
