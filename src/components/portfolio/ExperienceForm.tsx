
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ExperienceFormProps {
  data: Partial<Profile> | null;
  updateData: (key: string, value: any) => void;
}

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location: string;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, updateData }) => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(
    ((data?.experience as ExperienceItem[]) || [])
  );
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const defaultExperience: ExperienceItem = {
    id: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: ''
  };

  const handleAddNew = () => {
    setEditingExperience({
      ...defaultExperience,
      id: crypto.randomUUID()
    });
    setIsAddingNew(true);
  };

  const handleEditExisting = (experience: ExperienceItem) => {
    setEditingExperience(experience);
    setIsAddingNew(false);
  };

  const handleSaveExperience = () => {
    if (!editingExperience) return;

    let updatedExperiences: ExperienceItem[];
    
    if (isAddingNew) {
      updatedExperiences = [...experiences, editingExperience];
    } else {
      updatedExperiences = experiences.map(exp => 
        exp.id === editingExperience.id ? editingExperience : exp
      );
    }
    
    setExperiences(updatedExperiences);
    updateData('experience', updatedExperiences);
    setEditingExperience(null);
    setIsAddingNew(false);
  };

  const handleDeleteExperience = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    updateData('experience', updatedExperiences);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingExperience(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditingExperience(prev => {
      if (!prev) return null;
      return { ...prev, [name]: checked };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <Button 
          onClick={handleAddNew} 
          className="flex items-center gap-1"
          disabled={!!editingExperience}
        >
          <Plus size={18} /> Add Experience
        </Button>
      </div>

      {editingExperience ? (
        <Card className="border-2 border-portfolio-primary">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={editingExperience.company}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={editingExperience.position}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={editingExperience.location}
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
                  value={editingExperience.startDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={editingExperience.endDate}
                  onChange={handleInputChange}
                  disabled={editingExperience.current}
                />
                
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="current"
                    name="current"
                    checked={editingExperience.current}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <Label htmlFor="current">I currently work here</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                className="min-h-[120px]"
                value={editingExperience.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingExperience(null);
                  setIsAddingNew(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveExperience}>Save</Button>
            </div>
          </CardContent>
        </Card>
      ) : experiences.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No work experiences added yet. Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{experience.position}</h3>
                    <p className="text-gray-600">{experience.company}</p>
                    <p className="text-gray-500 text-sm">
                      {experience.location} | {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditExisting(experience)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteExperience(experience.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 whitespace-pre-line">{experience.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
