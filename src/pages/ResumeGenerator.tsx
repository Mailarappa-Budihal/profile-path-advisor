
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Download, RefreshCw, Edit } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];

const ResumeGenerator = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('template');
  const [profileData, setProfileData] = useState<Partial<Profile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  
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
      
      setProfileData(data);
    } catch (error: any) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load your profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateResume = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setActiveTab('preview');
      toast.success('Resume generated successfully!');
    }, 2000);
  };

  const handleEditProfile = () => {
    navigate('/portfolio-builder');
  };

  if (loading || isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) return null;

  const hasProfileData = profileData && 
    (profileData.experience && (profileData.experience as any[]).length > 0) && 
    (profileData.education && (profileData.education as any[]).length > 0);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resume Generator</h1>
        </div>

        {!hasProfileData ? (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <h2 className="text-xl font-semibold mb-4">Complete Your Profile First</h2>
              <p className="text-gray-600 mb-6">
                You need to add your work experience and education details to generate a resume.
              </p>
              <Button onClick={handleEditProfile}>
                <Edit className="mr-2 h-4 w-4" /> Complete Your Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b">
                <TabsList className="bg-transparent p-0 w-full flex overflow-x-auto">
                  <TabsTrigger value="template" className="flex-1 py-3">Choose Template</TabsTrigger>
                  <TabsTrigger value="customize" className="flex-1 py-3">Customize</TabsTrigger>
                  <TabsTrigger value="preview" className="flex-1 py-3">Preview & Download</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="template">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Select a Resume Template</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card 
                        className={`cursor-pointer hover:shadow-md transition-all border-2 ${
                          selectedTemplate === 'modern' ? 'border-portfolio-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedTemplate('modern')}
                      >
                        <CardContent className="pt-6 h-60 flex flex-col">
                          <h3 className="font-medium mb-2">Modern</h3>
                          <div className="flex-1 bg-gray-100 rounded relative">
                            <div className="absolute top-4 left-4 w-1/3 h-6 bg-gray-300 rounded"></div>
                            <div className="absolute top-14 left-4 right-4 h-3 bg-gray-300 rounded"></div>
                            <div className="absolute top-20 left-4 right-4 h-3 bg-gray-300 rounded"></div>
                            <div className="absolute top-28 left-4 w-2/3 h-10 bg-portfolio-primary opacity-20 rounded"></div>
                            <div className="absolute top-42 left-4 right-4 h-2 bg-gray-300 rounded"></div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer hover:shadow-md transition-all border-2 ${
                          selectedTemplate === 'professional' ? 'border-portfolio-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedTemplate('professional')}
                      >
                        <CardContent className="pt-6 h-60 flex flex-col">
                          <h3 className="font-medium mb-2">Professional</h3>
                          <div className="flex-1 bg-gray-100 rounded relative">
                            <div className="absolute top-0 left-0 bottom-0 w-1/4 bg-gray-300"></div>
                            <div className="absolute top-4 right-4 w-1/2 h-6 bg-gray-300 rounded"></div>
                            <div className="absolute top-14 right-4 w-2/3 h-3 bg-gray-300 rounded"></div>
                            <div className="absolute top-20 right-4 w-2/3 h-3 bg-gray-300 rounded"></div>
                            <div className="absolute top-28 right-4 w-1/3 h-10 bg-portfolio-primary opacity-20 rounded"></div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer hover:shadow-md transition-all border-2 ${
                          selectedTemplate === 'minimal' ? 'border-portfolio-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedTemplate('minimal')}
                      >
                        <CardContent className="pt-6 h-60 flex flex-col">
                          <h3 className="font-medium mb-2">Minimal</h3>
                          <div className="flex-1 bg-gray-100 rounded relative">
                            <div className="absolute top-4 left-4 right-4 h-6 bg-gray-300 rounded"></div>
                            <div className="absolute top-14 left-4 right-4 h-px bg-gray-400"></div>
                            <div className="absolute top-18 left-4 right-4 h-3 bg-gray-300 rounded"></div>
                            <div className="absolute top-24 left-4 right-4 h-3 bg-gray-300 rounded"></div>
                            <div className="absolute top-32 left-4 right-4 h-px bg-gray-400"></div>
                            <div className="absolute top-36 left-4 w-1/3 h-4 bg-portfolio-primary opacity-20 rounded"></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t">
                      <h2 className="text-xl font-semibold mb-4">Optimize For Job Description (Optional)</h2>
                      <p className="text-gray-600 mb-4">
                        Paste a job description to tailor your resume to the specific role.
                      </p>
                      
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Paste job description here..."
                          className="min-h-[150px]"
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={() => setActiveTab('customize')}>
                        Continue to Customize
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="customize">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Customize Your Resume</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="resumeTitle">Resume Title</Label>
                        <Input
                          id="resumeTitle"
                          placeholder="e.g., Senior Frontend Developer"
                          defaultValue={profileData?.headline || ''}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="resumeSummary">Professional Summary</Label>
                        <Textarea
                          id="resumeSummary"
                          placeholder="Write a brief professional summary..."
                          className="min-h-[100px]"
                          defaultValue={profileData?.summary || ''}
                        />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Included Sections</h3>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <input type="checkbox" id="includeExperience" defaultChecked className="mr-2" />
                            <Label htmlFor="includeExperience">Experience ({(profileData?.experience as any[])?.length || 0} items)</Label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="includeEducation" defaultChecked className="mr-2" />
                            <Label htmlFor="includeEducation">Education ({(profileData?.education as any[])?.length || 0} items)</Label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="includeSkills" defaultChecked className="mr-2" />
                            <Label htmlFor="includeSkills">Skills ({(profileData?.skills as any[])?.length || 0} categories)</Label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="includeProjects" defaultChecked className="mr-2" />
                            <Label htmlFor="includeProjects">Projects ({(profileData?.projects as any[])?.length || 0} items)</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('template')}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleGenerateResume} 
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
                          </>
                        ) : 'Generate Resume'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Resume Preview</h2>
                    
                    <div className="border rounded-lg p-8 bg-white min-h-[500px] shadow-inner">
                      <div className="max-w-4xl mx-auto">
                        {selectedTemplate === 'modern' && (
                          <ModernResumePreview data={profileData} />
                        )}
                        
                        {selectedTemplate === 'professional' && (
                          <ProfessionalResumePreview data={profileData} />
                        )}
                        
                        {selectedTemplate === 'minimal' && (
                          <MinimalResumePreview data={profileData} />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('customize')}>
                        Back to Edit
                      </Button>
                      <div className="space-x-2">
                        <Button variant="outline" onClick={handleGenerateResume} disabled={isGenerating}>
                          <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                        </Button>
                        <Button disabled>
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-center text-gray-500 text-sm">
                      <p>PDF download will be available soon.</p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const ModernResumePreview: React.FC<{ data: Partial<Profile> | null }> = ({ data }) => {
  if (!data) return null;
  
  const experiences = ((data.experience || []) as any[]);
  const education = ((data.education || []) as any[]);
  const skills = ((data.skills || []) as any[]);

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">{data.headline || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          {data.contact_info && (
            <>
              {(data.contact_info as any).email && (
                <span>{(data.contact_info as any).email}</span>
              )}
              {(data.contact_info as any).phone && (
                <span>{(data.contact_info as any).phone}</span>
              )}
              {(data.contact_info as any).location && (
                <span>{(data.contact_info as any).location}</span>
              )}
            </>
          )}
        </div>
      </div>
      
      {data.summary && (
        <div>
          <h2 className="text-lg font-semibold uppercase mb-2">Professional Summary</h2>
          <p>{data.summary}</p>
        </div>
      )}
      
      {experiences && experiences.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold uppercase mb-2">Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between font-medium">
                  <span>{exp.company} - {exp.position}</span>
                  <span className="text-gray-600">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{exp.location}</p>
                <p className="mt-1 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {education && education.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold uppercase mb-2">Education</h2>
          <div className="space-y-2">
            {education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <span className="font-medium">{edu.school}</span>
                  <span className="text-gray-600">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <p>{edu.degree} in {edu.field}</p>
                <p className="text-gray-600 text-sm">{edu.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold uppercase mb-2">Skills</h2>
          <div className="space-y-1">
            {skills.map((category: any) => (
              <div key={category.id}>
                <span className="font-medium">{category.name}: </span>
                <span>{category.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProfessionalResumePreview: React.FC<{ data: Partial<Profile> | null }> = ({ data }) => {
  if (!data) return null;
  
  const experiences = ((data.experience || []) as any[]);
  const education = ((data.education || []) as any[]);
  const skills = ((data.skills || []) as any[]);

  return (
    <div className="flex">
      <div className="w-1/3 bg-gray-100 p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold">{data.headline?.split(' ')[0] || 'Your'}</h1>
          <h1 className="text-xl font-bold">{data.headline?.split(' ').slice(1).join(' ') || 'Name'}</h1>
        </div>
        
        {data.contact_info && (
          <div className="mb-6">
            <h2 className="text-md font-semibold uppercase mb-2">Contact</h2>
            <div className="space-y-1 text-sm">
              {(data.contact_info as any).email && (
                <div>{(data.contact_info as any).email}</div>
              )}
              {(data.contact_info as any).phone && (
                <div>{(data.contact_info as any).phone}</div>
              )}
              {(data.contact_info as any).location && (
                <div>{(data.contact_info as any).location}</div>
              )}
            </div>
          </div>
        )}
        
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-md font-semibold uppercase mb-2">Skills</h2>
            <div className="space-y-3">
              {skills.map((category: any) => (
                <div key={category.id}>
                  <p className="font-medium text-sm">{category.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {category.skills.map((skill: string, i: number) => (
                      <span key={i} className="bg-gray-200 px-2 py-0.5 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="w-2/3 p-4">
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold uppercase mb-2">Profile</h2>
            <p className="text-sm">{data.summary}</p>
          </div>
        )}
        
        {experiences && experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold uppercase mb-2">Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp: any) => (
                <div key={exp.id}>
                  <div className="font-medium">{exp.position}</div>
                  <div className="text-gray-600 text-sm flex justify-between">
                    <span>{exp.company}, {exp.location}</span>
                    <span>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {education && education.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold uppercase mb-2">Education</h2>
            <div className="space-y-3">
              {education.map((edu: any) => (
                <div key={edu.id}>
                  <div className="font-medium">{edu.degree} in {edu.field}</div>
                  <div className="text-gray-600 text-sm flex justify-between">
                    <span>{edu.school}, {edu.location}</span>
                    <span>
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MinimalResumePreview: React.FC<{ data: Partial<Profile> | null }> = ({ data }) => {
  if (!data) return null;
  
  const experiences = ((data.experience || []) as any[]);
  const education = ((data.education || []) as any[]);
  const skills = ((data.skills || []) as any[]);

  return (
    <div className="space-y-6 px-2" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">{data.headline || 'Your Name'}</h1>
        
        {data.contact_info && (
          <div className="flex justify-center flex-wrap gap-3 mt-1 text-sm">
            {(data.contact_info as any).email && (
              <span>{(data.contact_info as any).email}</span>
            )}
            {(data.contact_info as any).phone && (
              <span>• {(data.contact_info as any).phone}</span>
            )}
            {(data.contact_info as any).location && (
              <span>• {(data.contact_info as any).location}</span>
            )}
          </div>
        )}
      </div>
      
      {data.summary && (
        <div>
          <h2 className="font-bold border-b text-sm uppercase mb-1">Summary</h2>
          <p className="text-sm">{data.summary}</p>
        </div>
      )}
      
      {experiences && experiences.length > 0 && (
        <div>
          <h2 className="font-bold border-b text-sm uppercase mb-1">Experience</h2>
          <div className="space-y-3">
            {experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{exp.position}</span>
                  <span>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm italic">{exp.company}, {exp.location}</p>
                <p className="text-xs mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {education && education.length > 0 && (
        <div>
          <h2 className="font-bold border-b text-sm uppercase mb-1">Education</h2>
          <div className="space-y-2">
            {education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{edu.school}</span>
                  <span>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <p className="text-sm">{edu.degree} in {edu.field}</p>
                <p className="text-xs italic">{edu.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {skills && skills.length > 0 && (
        <div>
          <h2 className="font-bold border-b text-sm uppercase mb-1">Skills</h2>
          <div className="text-sm">
            {skills.map((category: any, i: number) => (
              <span key={category.id}>
                <span className="font-medium">{category.name}: </span>
                <span>{category.skills.join(', ')}</span>
                {i < skills.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;
