
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
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
    ((data?.skills as SkillCategory[]) || [])
  );
  const [newCategory, setNewCategory] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    const categoryId = crypto.randomUUID();
    const newCat: SkillCategory = {
      id: categoryId,
      name: newCategory.trim(),
      skills: [],
    };
    
    const updatedCategories = [...skillCategories, newCat];
    setSkillCategories(updatedCategories);
    updateData('skills', updatedCategories);
    setNewCategory('');
    setActiveCategory(categoryId);
  };

  const handleRemoveCategory = (id: string) => {
    const updatedCategories = skillCategories.filter(cat => cat.id !== id);
    setSkillCategories(updatedCategories);
    updateData('skills', updatedCategories);
    if (activeCategory === id) {
      setActiveCategory(updatedCategories.length > 0 ? updatedCategories[0].id : null);
    }
  };

  const handleAddSkill = (categoryId: string) => {
    if (!newSkill.trim()) return;
    
    const updatedCategories = skillCategories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: [...cat.skills, newSkill.trim()]
        };
      }
      return cat;
    });
    
    setSkillCategories(updatedCategories);
    updateData('skills', updatedCategories);
    setNewSkill('');
  };

  const handleRemoveSkill = (categoryId: string, skill: string) => {
    const updatedCategories = skillCategories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: cat.skills.filter(s => s !== skill)
        };
      }
      return cat;
    });
    
    setSkillCategories(updatedCategories);
    updateData('skills', updatedCategories);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Skills</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Categories */}
        <div className="space-y-4">
          <h3 className="font-medium">Skill Categories</h3>
          
          <div className="flex gap-2 items-center">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name..."
            />
            <Button onClick={handleAddCategory}>Add</Button>
          </div>
          
          <div className="space-y-2 mt-4">
            {skillCategories.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No skill categories added yet.</p>
            ) : (
              skillCategories.map((category) => (
                <div 
                  key={category.id}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                    activeCategory === category.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{category.skills.length} skills</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCategory(category.id);
                      }}
                      className="text-red-500 hover:text-red-700 h-6 w-6"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right Column: Skills */}
        <div className="lg:col-span-2">
          {activeCategory ? (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-medium">
                  {skillCategories.find(cat => cat.id === activeCategory)?.name} Skills
                </h3>
                
                <div className="flex gap-2 items-center">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="New skill..."
                  />
                  <Button 
                    className="flex items-center gap-1"
                    onClick={() => handleAddSkill(activeCategory)}
                  >
                    <Plus size={18} /> Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {skillCategories.find(cat => cat.id === activeCategory)?.skills.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No skills added yet for this category.</p>
                  ) : (
                    skillCategories
                      .find(cat => cat.id === activeCategory)
                      ?.skills.map((skill, index) => (
                        <div 
                          key={index}
                          className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(activeCategory, skill)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                          >
                            &times;
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-6 text-center">
              <div>
                <p className="text-gray-500 mb-2">Select a skill category or create a new one to add skills.</p>
                <p className="text-gray-400 text-sm">Examples: Programming Languages, Frameworks, Soft Skills</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
