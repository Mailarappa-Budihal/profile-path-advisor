
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface BasicInfoFormProps {
  data: Partial<Profile> | null;
  updateData: (key: string, value: any) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, updateData }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData(name, value);
  };

  const handleContactInfoChange = (key: string, value: string) => {
    const contactInfo = data?.contact_info ? { ...data.contact_info } : {};
    updateData('contact_info', { ...contactInfo, [key]: value });
  };

  const handleSocialLinksChange = (key: string, value: string) => {
    const socialLinks = data?.social_links ? { ...data.social_links } : {};
    updateData('social_links', { ...socialLinks, [key]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      
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
                  value={(data?.contact_info as any)?.email || ''}
                  onChange={(e) => handleContactInfoChange('email', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 (123) 456-7890"
                  value={(data?.contact_info as any)?.phone || ''}
                  onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City, State, Country"
                  value={(data?.contact_info as any)?.location || ''}
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
                  value={(data?.social_links as any)?.linkedin || ''}
                  onChange={(e) => handleSocialLinksChange('linkedin', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  placeholder="https://github.com/yourusername"
                  value={(data?.social_links as any)?.github || ''}
                  onChange={(e) => handleSocialLinksChange('github', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  placeholder="https://yourwebsite.com"
                  value={(data?.social_links as any)?.portfolio || ''}
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
