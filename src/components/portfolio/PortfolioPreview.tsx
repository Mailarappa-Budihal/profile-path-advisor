import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database } from '@/integrations/supabase/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Share, Download, ExternalLink, Link, Github, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface PortfolioPreviewProps {
  portfolioData: Partial<Profile> | null;
}

// Define types for our structured data
interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  link: string;
  imageUrl: string;
}

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ portfolioData }) => {
  const [viewMode, setViewMode] = useState('modern');
  const [shareUrl, setShareUrl] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'deployed'>('idle');
  const [deployedUrl, setDeployedUrl] = useState('');
  const navigate = useNavigate();
  
  // Additional template options
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook') => {
    // Generate a dummy portfolio URL or use the deployed URL if available
    const portfolioUrl = deployedUrl || `https://portfolio.example.com/${portfolioData?.user_id || 'user'}`;
    
    let shareUrl = '';
    switch(platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(portfolioUrl)}&text=Check out my professional portfolio!`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioUrl)}`;
        break;
    }
    
    setShareUrl(shareUrl);
    window.open(shareUrl, '_blank', 'width=600,height=400');
    toast.success(`Shared to ${platform}!`);
  };

  const handleCopyLink = () => {
    const portfolioUrl = deployedUrl || `https://portfolio.example.com/${portfolioData?.user_id || 'user'}`;
    navigator.clipboard.writeText(portfolioUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeploymentStatus('deploying');
    
    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      setDeploymentStatus('deployed');
      setDeployedUrl(`https://portfolio-${Date.now().toString(36)}.example.com`);
      toast.success("Portfolio deployed successfully!");
    }, 3000);
  };

  const handleDownload = (format: 'html' | 'pdf') => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      toast.success(`Portfolio downloaded as ${format.toUpperCase()}`);
    }, 1500);
  };

  if (!portfolioData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Complete your profile information to preview your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Portfolio Preview</h2>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-56">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="modern">Modern</TabsTrigger>
              <TabsTrigger value="classic">Classic</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Deployment Status Banner */}
      {deploymentStatus === 'deployed' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex justify-between items-center">
          <div>
            <p className="text-green-800 font-medium">Portfolio Successfully Deployed!</p>
            <p className="text-green-700 text-sm">Your portfolio is live at: 
              <a 
                href={deployedUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-1 underline hover:text-green-900"
              >
                {deployedUrl}
              </a>
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-800 border-green-300 hover:bg-green-100"
            onClick={handleCopyLink}
          >
            <Link size={14} className="mr-1" />
            Copy URL
          </Button>
        </div>
      )}
      
      <div className="bg-white border rounded-lg overflow-hidden shadow-lg">
        <div className="p-6">
          {viewMode === 'modern' ? (
            <ModernPreview data={portfolioData} />
          ) : (
            <ClassicPreview data={portfolioData} />
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          <Button 
            onClick={handleDeploy} 
            disabled={isDeploying} 
            className="flex items-center gap-2"
          >
            <ExternalLink size={16} />
            {isDeploying ? 'Deploying...' : deploymentStatus === 'deployed' ? 'Redeploy Portfolio' : 'Publish Portfolio'}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Portfolio</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Button 
                  onClick={() => handleDownload('html')} 
                  variant="outline" 
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  <Download size={14} />
                  Download as HTML Site
                </Button>
                <Button 
                  onClick={() => handleDownload('pdf')} 
                  variant="outline" 
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  <Download size={14} />
                  Download as PDF Resume
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Share size={16} />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Portfolio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={() => handleShare('linkedin')} 
                    variant="outline" 
                    className="flex justify-center items-center gap-2"
                  >
                    <Linkedin size={16} />
                    Share on LinkedIn
                  </Button>
                  <Button 
                    onClick={() => handleShare('twitter')} 
                    variant="outline"
                    className="flex justify-center"
                  >
                    Share on Twitter
                  </Button>
                  <Button 
                    onClick={() => handleShare('facebook')} 
                    variant="outline"
                    className="flex justify-center"
                  >
                    Share on Facebook
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Direct Link</p>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={deployedUrl || `https://portfolio.example.com/${portfolioData?.user_id || 'user'}`}
                      readOnly
                    />
                    <Button 
                      size="sm" 
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      <Link size={14} />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        {deployedUrl ? (
          <p>Your portfolio is available at <span className="font-medium">{deployedUrl}</span></p>
        ) : (
          <p>Deploy your portfolio to get a shareable link</p>
        )}
      </div>
    </div>
  );
};

// Keep existing ModernPreview and ClassicPreview components
const ModernPreview: React.FC<{ data: Partial<Profile> }> = ({ data }) => {
  // Safely cast the JSON fields to their expected types
  const experiences = ((data.experience as unknown) as ExperienceItem[] || []);
  const education = ((data.education as unknown) as EducationItem[] || []);
  const projects = ((data.projects as unknown) as ProjectItem[] || []);
  const skills = ((data.skills as unknown) as SkillCategory[] || []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-portfolio-primary text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.headline || 'Your Name'}</h1>
        <p className="text-lg opacity-90">{data.summary || 'Professional Summary'}</p>
        
        <div className="mt-4 flex flex-wrap gap-4">
          {data.contact_info && (
            <>
              {(data.contact_info as any).email && (
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>{(data.contact_info as any).email}</span>
                </div>
              )}
              {(data.contact_info as any).phone && (
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <span>{(data.contact_info as any).phone}</span>
                </div>
              )}
              {(data.contact_info as any).location && (
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{(data.contact_info as any).location}</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-3">
          {data.social_links && (
            <>
              {(data.social_links as any).linkedin && (
                <a href={(data.social_links as any).linkedin} className="underline hover:text-white/80" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {(data.social_links as any).github && (
                <a href={(data.social_links as any).github} className="underline hover:text-white/80" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {(data.social_links as any).portfolio && (
                <a href={(data.social_links as any).portfolio} className="underline hover:text-white/80" target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              )}
            </>
          )}
        </div>
      </div>
      
      {experiences && experiences.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">Experience</h2>
          <div className="space-y-8">
            {experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{exp.position}</h3>
                    <p className="text-lg text-gray-700">{exp.company}</p>
                    <p className="text-gray-600">{exp.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-gray-800 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {education && education.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">Education</h2>
          <div className="space-y-6">
            {education.map((edu: any) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{edu.school}</h3>
                  <p className="text-gray-700">{edu.degree} in {edu.field}</p>
                  <p className="text-gray-600">{edu.location}</p>
                  {edu.description && <p className="mt-1 text-gray-800">{edu.description}</p>}
                </div>
                <div className="text-right">
                  <p className="text-gray-600">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {projects && projects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project: ProjectItem) => (
              <div key={project.id} className="border rounded-lg overflow-hidden">
                {project.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {project.startDate} - {project.current ? 'Ongoing' : project.endDate}
                  </p>
                  <p className="text-gray-800">{project.description}</p>
                  
                  {project.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.technologies.map((tech: string, index: number) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 px-2 py-0.5 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {project.link && (
                    <div className="mt-3">
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-portfolio-primary hover:underline text-sm"
                      >
                        View Project
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {skills && skills.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((category: any) => (
              <div key={category.id}>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill: string, index: number) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
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
  );
};

const ClassicPreview: React.FC<{ data: Partial<Profile> }> = ({ data }) => {
  // Safely cast the JSON fields to their expected types
  const experiences = ((data.experience as unknown) as ExperienceItem[] || []);
  const education = ((data.education as unknown) as EducationItem[] || []);
  const projects = ((data.projects as unknown) as ProjectItem[] || []);
  const skills = ((data.skills as unknown) as SkillCategory[] || []);

  return (
    <div className="max-w-4xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="text-center mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold mb-2">{data.headline || 'Your Name'}</h1>
        
        <div className="flex justify-center flex-wrap gap-4 mt-2 text-gray-700">
          {data.contact_info && (
            <>
              {(data.contact_info as any).email && (
                <span>{(data.contact_info as any).email}</span>
              )}
              {(data.contact_info as any).phone && (
                <>
                  <span>•</span>
                  <span>{(data.contact_info as any).phone}</span>
                </>
              )}
              {(data.contact_info as any).location && (
                <>
                  <span>•</span>
                  <span>{(data.contact_info as any).location}</span>
                </>
              )}
            </>
          )}
        </div>
        
        <div className="flex justify-center flex-wrap gap-4 mt-2">
          {data.social_links && (
            <>
              {(data.social_links as any).linkedin && (
                <a href={(data.social_links as any).linkedin} className="text-portfolio-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {(data.social_links as any).github && (
                <a href={(data.social_links as any).github} className="text-portfolio-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {(data.social_links as any).portfolio && (
                <a href={(data.social_links as any).portfolio} className="text-portfolio-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              )}
            </>
          )}
        </div>
        
        {data.summary && (
          <div className="mt-4 max-w-2xl mx-auto">
            <p className="text-gray-800">{data.summary}</p>
          </div>
        )}
      </div>
      
      {experiences && experiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 uppercase text-gray-800">Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold">{exp.company}</h3>
                  <p className="text-gray-600">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <p className="italic text-gray-700">{exp.position}, {exp.location}</p>
                <p className="mt-2 text-gray-800 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 uppercase text-gray-800">Education</h2>
          <div className="space-y-4">
            {education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">{edu.school}</h3>
                  <p className="text-gray-600">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                </div>
                <p className="italic text-gray-700">
                  {edu.degree} in {edu.field}, {edu.location}
                </p>
                {edu.description && <p className="mt-1 text-gray-800">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 uppercase text-gray-800">Projects</h2>
          <div className="space-y-4">
            {projects.map((project: ProjectItem) => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-portfolio-primary hover:underline text-sm"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {project.startDate} - {project.current ? 'Ongoing' : project.endDate}
                  </p>
                </div>
                <p className="mt-1 text-gray-800">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <p className="mt-1 text-gray-700 italic">
                    Technologies: {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {skills && skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 uppercase text-gray-800">Skills</h2>
          <div className="space-y-4">
            {skills.map((category: any) => (
              <div key={category.id}>
                <h3 className="font-semibold">{category.name}:</h3>
                <p className="text-gray-700">
                  {category.skills.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPreview;
