
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard 
            title="Portfolio Builder" 
            description="Create your professional portfolio website in minutes" 
            href="/portfolio-builder"
            icon="📝" 
          />
          <DashboardCard 
            title="Resume Generator" 
            description="Build an ATS-friendly resume tailored to your target roles" 
            href="/resume-generator"
            icon="📄" 
          />
          <DashboardCard 
            title="Cover Letter Writer" 
            description="Generate customized cover letters for job applications" 
            href="/cover-letter"
            icon="✉️" 
          />
          <DashboardCard 
            title="Mock Interviewer" 
            description="Practice interviews with AI feedback" 
            href="/mock-interview"
            icon="💬" 
          />
          <DashboardCard 
            title="Job Alerts" 
            description="Set up personalized job notifications" 
            href="/job-alerts"
            icon="🔔" 
          />
          <DashboardCard 
            title="Career Coaching" 
            description="Get AI-powered career advice and skill recommendations" 
            href="/career-coaching"
            icon="🚀" 
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

const DashboardCard = ({ title, description, href, icon }: { 
  title: string; 
  description: string; 
  href: string;
  icon: string;
}) => {
  return (
    <Link 
      to={href} 
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition-all"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h5 className="mb-2 text-xl font-bold tracking-tight">{title}</h5>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default Dashboard;
