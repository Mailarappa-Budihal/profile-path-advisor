
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProjectsFormProps {
  data: Partial<Profile> | null;
  updateData: (key: string, value: any) => void;
}

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

const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, updateData }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(
    ((data?.projects as ProjectItem[]) || [])
  );
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [techInput, setTechInput] = useState('');

  const defaultProject: ProjectItem = {
    id: '',
    title: '',
    description: '',
    technologies: [],
    startDate: '',
    endDate: '',
    current: false,
    link: '',
    imageUrl: '',
  };

  const handleAddNew = () => {
    setEditingProject({
      ...defaultProject,
      id: crypto.randomUUID()
    });
    setIsAddingNew(true);
    setTechInput('');
  };

  const handleEditExisting = (project: ProjectItem) => {
    setEditingProject(project);
    setIsAddingNew(false);
    setTechInput('');
  };

  const handleSaveProject = () => {
    if (!editingProject) return;

    let updatedProjects: ProjectItem[];
    
    if (isAddingNew) {
      updatedProjects = [...projects, editingProject];
    } else {
      updatedProjects = projects.map(proj => 
        proj.id === editingProject.id ? editingProject : proj
      );
    }
    
    setProjects(updatedProjects);
    updateData('projects', updatedProjects);
    setEditingProject(null);
    setIsAddingNew(false);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(proj => proj.id !== id);
    setProjects(updatedProjects);
    updateData('projects', updatedProjects);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingProject(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditingProject(prev => {
      if (!prev) return null;
      return { ...prev, [name]: checked };
    });
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !editingProject) return;
    
    setEditingProject(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        technologies: [...prev.technologies, techInput.trim()] 
      };
    });
    
    setTechInput('');
  };

  const handleRemoveTech = (tech: string) => {
    if (!editingProject) return;
    
    setEditingProject(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        technologies: prev.technologies.filter(t => t !== tech) 
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button 
          onClick={handleAddNew} 
          className="flex items-center gap-1"
          disabled={!!editingProject}
        >
          <Plus size={18} /> Add Project
        </Button>
      </div>

      {editingProject ? (
        <Card className="border-2 border-portfolio-primary">
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={editingProject.title}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                className="min-h-[120px]"
                value={editingProject.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={editingProject.startDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={editingProject.endDate}
                  onChange={handleInputChange}
                  disabled={editingProject.current}
                />
                
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="current"
                    name="current"
                    checked={editingProject.current}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <Label htmlFor="current">This is an ongoing project</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="link">Project Link</Label>
              <Input
                id="link"
                name="link"
                type="url"
                placeholder="https://example.com"
                value={editingProject.link}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Project Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={editingProject.imageUrl}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="technologies">Technologies Used</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="technologies"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g., React, TypeScript"
                />
                <Button type="button" onClick={handleAddTech}>Add</Button>
              </div>
              
              {editingProject.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingProject.technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingProject(null);
                  setIsAddingNew(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProject}>Save</Button>
            </div>
          </CardContent>
        </Card>
      ) : projects && projects.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No projects added yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects && projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                {project.imageUrl && (
                  <div className="w-full h-40 mb-4 overflow-hidden rounded-md">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{project.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {project.startDate} - {project.current ? 'Ongoing' : project.endDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditExisting(project)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 line-clamp-3">{project.description}</p>
                
                {project.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <span 
                        key={`${project.id}-${tech}`} 
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
