import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface EducationFormProps {
  data: Partial<Profile> | null;
  updateData: (key: string, value: any) => void;
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

const EducationForm: React.FC<EducationFormProps> = ({ data, updateData }) => {
  const [educationList, setEducationList] = useState<EducationItem[]>(
    ((data?.education as unknown) as EducationItem[] || [])
  );
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const defaultEducation: EducationItem = {
    id: '',
    school: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  };

  const handleAddNew = () => {
    setEditingEducation({
      ...defaultEducation,
      id: crypto.randomUUID()
    });
    setIsAddingNew(true);
  };

  const handleEditExisting = (education: EducationItem) => {
    setEditingEducation(education);
    setIsAddingNew(false);
  };

  const handleSaveEducation = () => {
    if (!editingEducation) return;

    let updatedEducationList: EducationItem[];
    
    if (isAddingNew) {
      updatedEducationList = [...educationList, editingEducation];
    } else {
      updatedEducationList = educationList.map(edu => 
        edu.id === editingEducation.id ? editingEducation : edu
      );
    }
    
    setEducationList(updatedEducationList);
    updateData('education', updatedEducationList);
    setEditingEducation(null);
    setIsAddingNew(false);
  };

  const handleDeleteEducation = (id: string) => {
    const updatedEducationList = educationList.filter(edu => edu.id !== id);
    setEducationList(updatedEducationList);
    updateData('education', updatedEducationList);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingEducation(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditingEducation(prev => {
      if (!prev) return null;
      return { ...prev, [name]: checked };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button 
          onClick={handleAddNew} 
          className="flex items-center gap-1"
          disabled={!!editingEducation}
        >
          <Plus size={18} /> Add Education
        </Button>
      </div>

      {editingEducation ? (
        <Card className="border-2 border-portfolio-primary">
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="school">School Name</Label>
              <Input
                id="school"
                name="school"
                value={editingEducation.school}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                name="degree"
                value={editingEducation.degree}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                name="field"
                value={editingEducation.field}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={editingEducation.location}
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
                  value={editingEducation.startDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={editingEducation.endDate}
                  onChange={handleInputChange}
                  disabled={editingEducation.current}
                />
                
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="current"
                    name="current"
                    checked={editingEducation.current}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <Label htmlFor="current">I currently study here</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="min-h-[120px]"
                value={editingEducation.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingEducation(null);
                  setIsAddingNew(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEducation}>Save</Button>
            </div>
          </CardContent>
        </Card>
      ) : educationList && educationList.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No education added yet. Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educationList && educationList.map((education) => (
            <Card key={education.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{education.school}</h3>
                    <p className="text-gray-500 text-sm">{education.degree} in {education.field}</p>
                    <p className="text-gray-500 text-sm">
                      {education.startDate} - {education.current ? 'Present' : education.endDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditExisting(education)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteEducation(education.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 line-clamp-3">{education.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
