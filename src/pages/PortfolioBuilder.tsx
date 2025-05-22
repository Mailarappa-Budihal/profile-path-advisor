
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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Upload, Linkedin, Github, RefreshCw, FileText } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];

const PortfolioBuilder = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [portfolioData, setPortfolioData] = useState<Partial<Profile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleResumeUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a resume file");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate parsing resume and generating portfolio data
      // In a real implementation, you would send the file to a backend service
      // that would parse the resume and return structured data
      setTimeout(() => {
        const mockPortfolioData = {
          headline: "Frontend Developer",
          summary: "Experienced frontend developer with skills in React, TypeScript, and UI/UX design.",
          experience: [
            {
              id: "1",
              company: "Tech Company",
              position: "Senior Frontend Developer",
              location: "San Francisco, CA",
              startDate: "2020-03",
              endDate: "",
              current: true,
              description: "Led frontend development for multiple projects using React, TypeScript, and Tailwind CSS."
            },
            {
              id: "2",
              company: "Startup Inc.",
              position: "Frontend Developer",
              location: "Remote",
              startDate: "2018-05",
              endDate: "2020-02",
              current: false,
              description: "Developed responsive web applications and collaborated with design team."
            }
          ],
          education: [
            {
              id: "1",
              school: "University of Technology",
              degree: "Bachelor's",
              field: "Computer Science",
              location: "Boston, MA",
              startDate: "2014-09",
              endDate: "2018-05",
              current: false,
              description: "Graduated with honors."
            }
          ],
          skills: [
            {
              id: "1",
              name: "Frontend Technologies",
              skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS"]
            },
            {
              id: "2",
              name: "Tools & Others",
              skills: ["Git", "Figma", "Jest", "RESTful APIs", "Agile Methodologies"]
            }
          ],
          projects: [
            {
              id: "1",
              title: "E-commerce Platform",
              description: "Developed a responsive e-commerce platform with product filtering, cart functionality, and payment integration.",
              technologies: ["React", "Node.js", "Express", "MongoDB"],
              startDate: "2021-01",
              endDate: "2021-04",
              current: false,
              link: "https://example.com/project",
              imageUrl: ""
            }
          ],
          contact_info: {
            email: user?.email || "",
            phone: "123-456-7890",
            location: "San Francisco, CA"
          },
          social_links: {
            linkedin: "https://linkedin.com/in/username",
            github: "https://github.com/username",
            portfolio: "https://portfolio.example.com"
          }
        };

        // Update portfolio data with parsed resume data
        setPortfolioData(prev => ({
          ...prev,
          ...mockPortfolioData
        }));

        setIsGenerating(false);
        toast.success("Resume parsed successfully! Your portfolio has been generated.");
        setActiveTab('preview');
      }, 2000);
    } catch (error) {
      console.error("Error parsing resume:", error);
      setIsGenerating(false);
      toast.error("Error parsing resume. Please try again.");
    }
  };

  const handleImportSocialProfile = (platform: 'linkedin' | 'github') => {
    setIsImporting(true);

    // Simulate importing profile data from social platforms
    setTimeout(() => {
      const platformData = platform === 'linkedin' 
        ? {
            headline: "Senior Frontend Developer at Tech Company",
            summary: "Passionate about creating intuitive user interfaces and exceptional web experiences.",
            experience: [
              {
                id: "1",
                company: "Tech Company",
                position: "Senior Frontend Developer",
                location: "San Francisco, CA",
                startDate: "2020-03",
                endDate: "",
                current: true,
                description: "Leading frontend development efforts for enterprise-level applications."
              },
              // Additional experiences would be added here
            ],
            skills: [
              {
                id: "1",
                name: "Professional Skills",
                skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML", "UI/UX Design"]
              }
            ],
          }
        : {
            projects: [
              {
                id: "1",
                title: "Personal Website",
                description: "Modern portfolio website built with React and Tailwind CSS.",
                technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
                startDate: "2022-01",
                endDate: "2022-03",
                current: false,
                link: "https://github.com/username/personal-website",
                imageUrl: ""
              },
              {
                id: "2",
                title: "Task Management App",
                description: "A full-stack application for managing tasks and projects.",
                technologies: ["React", "Node.js", "Express", "MongoDB"],
                startDate: "2021-08",
                endDate: "2021-12",
                current: false,
                link: "https://github.com/username/task-app",
                imageUrl: ""
              }
            ],
            social_links: {
              github: "https://github.com/username"
            }
          };

      // Update portfolio data with imported social profile data
      setPortfolioData(prev => ({
        ...prev,
        ...platformData
      }));

      setIsImporting(false);
      toast.success(`Successfully imported ${platform} profile!`);
      setIsImportDialogOpen(false);
      
      // Navigate to relevant tab based on imported data
      if (platform === 'linkedin') {
        setActiveTab('experience');
      } else {
        setActiveTab('projects');
      }
    }, 2000);
  };

  const handleGenerateAIPortfolio = () => {
    if (!portfolioData) return;

    setIsGenerating(true);
    
    // Simulate AI processing and portfolio generation
    setTimeout(() => {
      // Enhanced portfolio data generated by "AI"
      const enhancedData = {
        summary: portfolioData.summary 
          ? portfolioData.summary + " Specializing in creating responsive, user-friendly web applications with modern JavaScript frameworks."
          : "Professional developer specializing in creating responsive, user-friendly web applications with modern JavaScript frameworks.",
        
        // Update experience descriptions to be more professional
        experience: portfolioData.experience 
          ? (portfolioData.experience as any[]).map(exp => ({
              ...exp,
              description: exp.description + " Collaborated with cross-functional teams to deliver high-quality solutions on time and within scope."
            }))
          : [],
          
        // Add skills if missing
        skills: portfolioData.skills || [
          {
            id: "1",
            name: "Programming Languages",
            skills: ["JavaScript", "TypeScript", "HTML", "CSS"]
          },
          {
            id: "2",
            name: "Frameworks & Libraries",
            skills: ["React", "Node.js", "Express", "Tailwind CSS"]
          }
        ]
      };

      // Update portfolio data with AI-enhanced content
      setPortfolioData(prev => ({
        ...prev,
        ...enhancedData
      }));

      setIsGenerating(false);
      toast.success("AI has enhanced your portfolio! Preview to see the results.");
      setActiveTab('preview');
    }, 2500);
  };

  if (loading || isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">AI Portfolio Builder</h1>
          <p className="text-gray-600">Create a professional portfolio by importing your resume or connecting your social profiles</p>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Import</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Resume Upload Card */}
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Upload Resume</h3>
                  <p className="text-sm text-gray-600 mb-4">Upload your resume and we'll create your portfolio automatically</p>
                  <div className="flex flex-col w-full gap-2">
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      className="text-sm"
                      onChange={handleFileChange}
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleResumeUpload}
                      disabled={!selectedFile || isGenerating}
                    >
                      {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {isGenerating ? "Processing..." : "Upload & Generate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Import Card */}
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Linkedin className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Import Social Profiles</h3>
                  <p className="text-sm text-gray-600 mb-4">Connect your LinkedIn or GitHub to import your professional data</p>
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Connect Profiles</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import Professional Profile</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-4">
                        <p className="text-sm text-gray-600">Choose a platform to import your professional information from:</p>
                        <Button
                          className="flex items-center gap-2"
                          onClick={() => handleImportSocialProfile('linkedin')}
                          disabled={isImporting}
                        >
                          <Linkedin className="h-4 w-4" />
                          {isImporting ? "Connecting..." : "Import from LinkedIn"}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => handleImportSocialProfile('github')}
                          disabled={isImporting}
                        >
                          <Github className="h-4 w-4" />
                          {isImporting ? "Connecting..." : "Import from GitHub"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* AI Enhancement Card */}
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <RefreshCw className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Enhancement</h3>
                  <p className="text-sm text-gray-600 mb-4">Let our AI improve your existing portfolio content</p>
                  <Button 
                    variant="outline"
                    onClick={handleGenerateAIPortfolio}
                    disabled={isGenerating || !portfolioData}
                  >
                    {isGenerating ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Build Your Portfolio</h2>
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
