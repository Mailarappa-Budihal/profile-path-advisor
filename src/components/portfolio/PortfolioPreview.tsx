
import React, { useState } from 'react';
import { Database } from '@/integrations/supabase/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Calendar, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import PortfolioActions from './PortfolioActions';

type Profile = Database['public']['Tables']['profiles']['Row'];

// Define proper types for JSON fields
interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

interface Experience {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  current?: boolean;
  link?: string;
  imageUrl?: string;
}

interface SkillGroup {
  id: string;
  name: string;
  skills: string[];
}

interface PortfolioPreviewProps {
  portfolioData: Partial<Profile> | null;
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ portfolioData }) => {
  const [viewStyle, setViewStyle] = useState<'modern' | 'classic'>('modern');
  
  if (!portfolioData) {
    return <div className="p-8 text-center text-gray-500">No portfolio data available. Please add information using the forms.</div>;
  }

  const {
    headline,
    summary,
    experience = [],
    education = [],
    projects = [],
    skills = [],
    contact_info = {},
    social_links = {}
  } = portfolioData;

  // Cast JSON fields to their proper types
  const typedExperience = experience as unknown as Experience[];
  const typedEducation = education as unknown as Education[];
  const typedProjects = projects as unknown as Project[];
  const typedSkills = skills as unknown as SkillGroup[];
  const typedContactInfo = contact_info as unknown as ContactInfo;
  const typedSocialLinks = social_links as unknown as SocialLinks;

  const sortedExperience = Array.isArray(typedExperience) 
    ? [...typedExperience].sort((a, b) => {
        // Sort by current first, then by start date descending
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        return new Date(b.startDate || '') > new Date(a.startDate || '') ? 1 : -1;
      })
    : [];

  const sortedEducation = Array.isArray(typedEducation)
    ? [...typedEducation].sort((a, b) => new Date(b.startDate || '') > new Date(a.startDate || '') ? 1 : -1)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={viewStyle} onValueChange={(v) => setViewStyle(v as 'modern' | 'classic')}>
          <TabsList>
            <TabsTrigger value="modern">Modern View</TabsTrigger>
            <TabsTrigger value="classic">Classic View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <PortfolioActions 
          portfolioId="my-portfolio"
          portfolioUrl="https://portfolio.example.com/my-portfolio"
        />
      </div>
      
      {viewStyle === 'modern' && (
        <div className="space-y-8 bg-white p-8 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-3xl font-bold">{typedContactInfo.name || 'Your Name'}</h1>
            <h2 className="text-xl text-gray-700">{headline || 'Your Headline'}</h2>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
              {typedContactInfo.email && <span>{typedContactInfo.email}</span>}
              {typedContactInfo.phone && <span>{typedContactInfo.phone}</span>}
              {typedContactInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {typedContactInfo.location}
                </span>
              )}
            </div>
            <div className="flex justify-center gap-4">
              {typedSocialLinks.linkedin && (
                <a href={typedSocialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800">
                  LinkedIn
                </a>
              )}
              {typedSocialLinks.github && (
                <a href={typedSocialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800">
                  GitHub
                </a>
              )}
              {typedSocialLinks.portfolio && (
                <a href={typedSocialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800">
                  Portfolio
                </a>
              )}
            </div>
          </div>
  
          {/* Summary Section */}
          {summary && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold border-b pb-2">Summary</h3>
              <p className="text-gray-700">{summary}</p>
            </div>
          )}
  
          {/* Experience Section */}
          {sortedExperience.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Experience</h3>
              <div className="space-y-6">
                {sortedExperience.map((exp, index) => (
                  <div key={exp.id || index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{exp.position}</h4>
                      {exp.current && <Badge className="bg-green-100 text-green-800 border-green-200">Current</Badge>}
                    </div>
                    <div className="text-gray-700">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exp.startDate} {exp.current ? '- Present' : exp.endDate ? `- ${exp.endDate}` : ''}
                    </div>
                    {exp.description && <p className="text-gray-600">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {/* Education Section */}
          {sortedEducation.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Education</h3>
              <div className="space-y-6">
                {sortedEducation.map((edu, index) => (
                  <div key={edu.id || index} className="space-y-2">
                    <h4 className="font-semibold">{edu.degree} in {edu.field}</h4>
                    <div className="text-gray-700">{edu.school}{edu.location ? `, ${edu.location}` : ''}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </div>
                    {edu.description && <p className="text-gray-600">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {/* Projects Section */}
          {Array.isArray(typedProjects) && typedProjects.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {typedProjects.map((project, index) => (
                  <Card key={project.id || index}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{project.title}</h4>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {project.description && <p className="text-sm text-gray-600">{project.description}</p>}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="bg-gray-100">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {project.startDate && (
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(project.startDate), { addSuffix: true })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
  
          {/* Skills Section */}
          {Array.isArray(typedSkills) && typedSkills.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Skills</h3>
              <div className="space-y-4">
                {typedSkills.map((skillGroup, index) => (
                  <div key={skillGroup.id || index} className="space-y-2">
                    <h4 className="font-medium text-gray-700">{skillGroup.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.skills && skillGroup.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} className="bg-gray-100 text-gray-800 border-gray-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
  
      {viewStyle === 'classic' && (
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          {/* Classic Layout - Similar to a traditional resume */}
          <div className="border-b-2 border-gray-700 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-center">{typedContactInfo.name || 'Your Name'}</h1>
            <p className="text-center text-gray-600">{headline || 'Your Professional Title'}</p>
            <div className="flex justify-center flex-wrap gap-3 mt-2 text-sm">
              {typedContactInfo.email && <span>{typedContactInfo.email}</span>}
              {typedContactInfo.phone && <span> • {typedContactInfo.phone}</span>}
              {typedContactInfo.location && <span> • {typedContactInfo.location}</span>}
              {typedSocialLinks.linkedin && (
                <span> • <a href={typedSocialLinks.linkedin} className="text-blue-600 hover:underline">LinkedIn</a></span>
              )}
            </div>
          </div>
  
          {summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase mb-2">Summary</h2>
              <p>{summary}</p>
            </div>
          )}
  
          {sortedExperience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase mb-2">Professional Experience</h2>
              {sortedExperience.map((exp, index) => (
                <div key={exp.id || index} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{exp.position}</h3>
                    <p className="text-sm">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  <p className="italic">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  {exp.description && <p className="mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
  
          {sortedEducation.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase mb-2">Education</h2>
              {sortedEducation.map((edu, index) => (
                <div key={edu.id || index} className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                    <p className="text-sm">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </p>
                  </div>
                  <p className="italic">{edu.school}{edu.location ? `, ${edu.location}` : ''}</p>
                </div>
              ))}
            </div>
          )}
  
          {Array.isArray(typedSkills) && typedSkills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase mb-2">Skills</h2>
              <div className="space-y-2">
                {typedSkills.map((skillGroup, index) => (
                  <div key={skillGroup.id || index}>
                    <h3 className="font-semibold">{skillGroup.name}</h3>
                    <p>{skillGroup.skills ? skillGroup.skills.join(', ') : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {Array.isArray(typedProjects) && typedProjects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold uppercase mb-2">Projects</h2>
              {typedProjects.map((project, index) => (
                <div key={project.id || index} className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{project.title}</h3>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        View Project
                      </a>
                    )}
                  </div>
                  {project.description && <p className="mt-1">{project.description}</p>}
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-sm italic mt-1">Technologies: {project.technologies.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioPreview;
