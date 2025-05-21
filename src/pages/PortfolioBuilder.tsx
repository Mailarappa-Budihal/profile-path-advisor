import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BasicInfoForm from '@/components/portfolio/BasicInfoForm';
import ExperienceForm from '@/components/portfolio/ExperienceForm';
import EducationForm from '@/components/portfolio/EducationForm';
import ProjectsForm from '@/components/portfolio/ProjectsForm';
import SkillsForm from '@/components/portfolio/SkillsForm';
import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const PortfolioBuilder = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [portfolioData, setPortfolioData] = useState<Partial<Profile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchProfileData();
    }
  }, [user, loading, navigate]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      setPortfolioData(data);
    } catch (error: any) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load your profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePortfolio = async () => {
    if (!user || !portfolioData) return;
    
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          ...portfolioData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Portfolio saved successfully!');
    } catch (error: any) {
      console.error('Error saving portfolio data:', error);
      toast.error('Failed to save your portfolio data');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePortfolioData = (key: string, value: any) => {
    setPortfolioData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading || isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Portfolio Builder</h1>
          <Button 
            onClick={handleSavePortfolio}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Portfolio'}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="bg-transparent p-0 w-full flex overflow-x-auto">
                <TabsTrigger value="basic-info" className="flex-1 py-3">Basic Info</TabsTrigger>
                <TabsTrigger value="experience" className="flex-1 py-3">Experience</TabsTrigger>
                <TabsTrigger value="education" className="flex-1 py-3">Education</TabsTrigger>
                <TabsTrigger value="projects" className="flex-1 py-3">Projects</TabsTrigger>
                <TabsTrigger value="skills" className="flex-1 py-3">Skills</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1 py-3">Preview</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="basic-info">
                <BasicInfoForm 
                  data={portfolioData} 
                  updateData={updatePortfolioData} 
                />
              </TabsContent>
              
              <TabsContent value="experience">
                <ExperienceForm 
                  data={portfolioData} 
                  updateData={updatePortfolioData} 
                />
              </TabsContent>
              
              <TabsContent value="education">
                <EducationForm 
                  data={portfolioData} 
                  updateData={updatePortfolioData} 
                />
              </TabsContent>
              
              <TabsContent value="projects">
                <ProjectsForm 
                  data={portfolioData} 
                  updateData={updatePortfolioData} 
                />
              </TabsContent>
              
              <TabsContent value="skills">
                <SkillsForm 
                  data={portfolioData} 
                  updateData={updatePortfolioData} 
                />
              </TabsContent>
              
              <TabsContent value="preview">
                <PortfolioPreview portfolioData={portfolioData} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PortfolioBuilder;
