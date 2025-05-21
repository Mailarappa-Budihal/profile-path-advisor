
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const PortfolioBuilder = () => {
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
        <h1 className="text-3xl font-bold mb-6">Portfolio Builder</h1>
        <p className="text-gray-600 mb-8">
          Create a professional portfolio website in minutes using AI. Upload your resume or answer a few questions to get started.
        </p>
        
        {/* Placeholder for future implementation */}
        <div className="bg-white rounded-lg shadow p-6 text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We're working hard to bring you this feature. Check back soon!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PortfolioBuilder;
