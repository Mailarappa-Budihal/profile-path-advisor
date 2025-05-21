import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface SkillsFormProps {
  data: Partial<Profile> | null;
  updateData: (key: string, value: any) => void;
}

interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data, updateData }) => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(
    ((data?.skills as unknown) as SkillCategory[] || [])
  );
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const defaultCategory: SkillCategory = {
    id: '',
    name: '',
    skills: [],
  };

  const handleAddNew = () => {
    setEditingCategory({
      ...defaultCategory,
      id: crypto.randomUUID()
    });
    setIsAddingNew(true);
    setSkillInput('');
  };

  const handleEditExisting = (category: SkillCategory) => {
    setEditingCategory(category);
    setIsAddingNew(false);
    setSkillInput('');
  };

  const handleSaveCategory = () => {
    if (!editingCategory) return;

    let updatedCategories: SkillCategory[];
    
    if (isAddingNew) {
      updatedCategories = [...skillCategories, editingCategory];
    } else {
      updatedCategories = skillCategories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      );
    }
    
    setSkillCategories(updatedCategories);
    updateData('skills', updatedCategories);
    setEditingCategory(null);
    setIsAddingNew(false);
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = skillCategories.filter(cat => cat.id !== id);
    setSkillCategories(updatedCategories);
    updateData('skills', updatedCategories);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingCategory(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleAddSkill = () => {
    if (!skillInput.trim() || !editingCategory) return;
    
    setEditingCategory(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        skills: [...prev.skills, skillInput.trim()] 
      };
    });
    
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    if (!editingCategory) return;
    
    setEditingCategory(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        skills: prev.skills.filter(s => s !== skill) 
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Button 
          onClick={handleAddNew} 
          className="flex items-center gap-1"
          disabled={!!editingCategory}
        >
          <Plus size={18} /> Add Category
        </Button>
      </div>

      {editingCategory ? (
        <Card className="border-2 border-portfolio-primary">
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={editingCategory.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g., React, TypeScript"
                />
                <Button type="button" onClick={handleAddSkill}>Add</Button>
              </div>
              
              {editingCategory.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingCategory.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
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
                  setEditingCategory(null);
                  setIsAddingNew(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveCategory}>Save</Button>
            </div>
          </CardContent>
        </Card>
      ) : skillCategories && skillCategories.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No skill categories added yet. Click "Add Category" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillCategories && skillCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{category.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditExisting(category)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
                
                {category.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {category.skills.map((skill) => (
                      <span 
                        key={`${category.id}-${skill}`} 
                        className="bg-gray-100 px-2 py-0.5 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
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

export default SkillsForm;
