
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const CoverLetterWriter = () => {
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
        <h1 className="text-3xl font-bold mb-6">Cover Letter Writer</h1>
        <p className="text-gray-600 mb-8">
          Create personalized cover letters tailored to specific job descriptions with AI assistance.
        </p>
        
        {/* Coming Soon Placeholder */}
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-portfolio-primary/10 rounded-full">
                <FileText className="w-12 h-12 text-portfolio-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Our AI-powered Cover Letter Writer is currently in development. Soon you'll be able to generate
              customized cover letters that match your experience with specific job requirements.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoverLetterWriter;
