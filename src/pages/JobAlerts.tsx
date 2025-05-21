
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const JobAlerts = () => {
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
        <h1 className="text-3xl font-bold mb-6">Job Alerts</h1>
        <p className="text-gray-600 mb-8">
          Set up personalized job notifications for roles matching your skills and preferences.
        </p>
        
        {/* Coming Soon Placeholder */}
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-portfolio-primary/10 rounded-full">
                <Bell className="w-12 h-12 text-portfolio-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Our Job Alerts system is currently in development. Soon you'll be able to receive
              notifications about relevant job openings across multiple platforms that match your
              skills and career goals.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobAlerts;
