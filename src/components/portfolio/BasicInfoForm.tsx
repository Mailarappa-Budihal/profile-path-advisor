
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Upload, Github, Linkedin, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface BasicInfoFormProps {
  data: Partial<Profile> | null;
  updateData: (key: string, value: any) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, updateData }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [importSource, setImportSource] = useState<'resume' | 'linkedin' | 'github' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData(name, value);
  };

  const handleContactInfoChange = (key: string, value: string) => {
    const contactInfo = ((data?.contact_info as Record<string, unknown>) || {}) as Record<string, unknown>;
    updateData('contact_info', { ...contactInfo, [key]: value });
  };

  const handleSocialLinksChange = (key: string, value: string) => {
    const socialLinks = ((data?.social_links as Record<string, unknown>) || {}) as Record<string, unknown>;
    updateData('social_links', { ...socialLinks, [key]: value });
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
      setImportSource('resume');
    }
  };
  
  const handleImportFromResume = async () => {
    if (!resumeFile) {
      toast.error("Please upload a resume file first");
      return;
    }
    
    setIsImporting(true);
    
    // In a real implementation, we would send the file to a backend service
    // that would parse the resume and return structured data
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successfully parsed data
      updateData('headline', 'Frontend Developer | React Specialist');
      updateData('summary', 'Experienced frontend developer with 5+ years of experience building modern web applications with React, TypeScript, and related technologies.');
      
      const contactInfo = ((data?.contact_info as Record<string, unknown>) || {}) as Record<string, unknown>;
      updateData('contact_info', { 
        ...contactInfo, 
        email: 'developer@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA' 
      });
      
      toast.success("Resume imported successfully!");
    } catch (error) {
      toast.error("Failed to import resume");
      console.error(error);
    } finally {
      setIsImporting(false);
      setImportSource(null);
    }
  };
  
  const handleImportFromLinkedIn = () => {
    setImportSource('linkedin');
    setIsImporting(true);
    
    // In a real implementation, this would initiate OAuth flow
    // and then call a backend to fetch LinkedIn data
    toast.error("LinkedIn import feature is coming soon");
    setIsImporting(false);
    setImportSource(null);
  };
  
  const handleImportFromGithub = () => {
    setImportSource('github');
    setIsImporting(true);
    
    // In a real implementation, this would initiate OAuth flow
    // and then call a backend to fetch GitHub data
    toast.error("GitHub import feature is coming soon");
    setIsImporting(false);
    setImportSource(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Upload size={16} /> Import Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Your Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="resume-upload">Upload Resume</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="resume-upload" 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleResumeUpload} 
                    />
                    <Button 
                      onClick={handleImportFromResume} 
                      disabled={!resumeFile || isImporting} 
                      size="sm"
                    >
                      {isImporting && importSource === 'resume' ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                      ) : (
                        <FileText size={16} className="mr-2" />
                      )}
                      Import
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Import from Social Profiles</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleImportFromLinkedIn} 
                      disabled={isImporting}
                    >
                      {isImporting && importSource === 'linkedin' ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                      ) : (
                        <Linkedin size={16} className="mr-2" />
                      )}
                      LinkedIn
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleImportFromGithub} 
                      disabled={isImporting}
                    >
                      {isImporting && importSource === 'github' ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                      ) : (
                        <Github size={16} className="mr-2" />
                      )}
                      GitHub
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="headline">Professional Headline</Label>
            <Input
              id="headline"
              name="headline"
              placeholder="e.g., Frontend Developer | React Specialist | UI/UX Enthusiast"
              value={data?.headline || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              placeholder="Write a brief summary about your professional background, skills, and career goals..."
              className="min-h-[120px]"
              value={data?.summary || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium">Contact Information</h3>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={(data?.contact_info as Record<string, any>)?.email || ''}
                  onChange={(e) => handleContactInfoChange('email', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 (123) 456-7890"
                  value={(data?.contact_info as Record<string, any>)?.phone || ''}
                  onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City, State, Country"
                  value={(data?.contact_info as Record<string, any>)?.location || ''}
                  onChange={(e) => handleContactInfoChange('location', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium">Social Links</h3>
              
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={(data?.social_links as Record<string, any>)?.linkedin || ''}
                  onChange={(e) => handleSocialLinksChange('linkedin', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  placeholder="https://github.com/yourusername"
                  value={(data?.social_links as Record<string, any>)?.github || ''}
                  onChange={(e) => handleSocialLinksChange('github', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  placeholder="https://yourwebsite.com"
                  value={(data?.social_links as Record<string, any>)?.portfolio || ''}
                  onChange={(e) => handleSocialLinksChange('portfolio', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
