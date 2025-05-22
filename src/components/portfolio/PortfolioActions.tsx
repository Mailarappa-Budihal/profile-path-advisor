
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Share, Download, Link as LinkIcon, Linkedin, Twitter, Facebook, Copy, ExternalLink, Code } from 'lucide-react';

interface PortfolioActionsProps {
  portfolioId?: string;
  portfolioUrl?: string;
}

const PortfolioActions: React.FC<PortfolioActionsProps> = ({ 
  portfolioId = 'demo-portfolio',
  portfolioUrl = 'https://portfolio.example.com/demo-portfolio'
}) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    toast.success('Portfolio link copied to clipboard!');
  };
  
  const handleDownload = (format: 'pdf' | 'html' | 'json') => {
    // In a real implementation, this would generate and download the file
    // For now, we'll just simulate a download with a toast notification
    toast.success(`Portfolio ${format.toUpperCase()} download started`);
    
    // Simulate download completion after a delay
    setTimeout(() => {
      toast.success(`Portfolio successfully downloaded as ${format.toUpperCase()}`);
    }, 2000);
  };
  
  const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook' | 'email') => {
    let shareUrl;
    
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(portfolioUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(portfolioUrl)}&text=${encodeURIComponent('Check out my professional portfolio!')}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('My Professional Portfolio')}&body=${encodeURIComponent(`Check out my portfolio: ${portfolioUrl}`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      setIsShareDialogOpen(false);
    }
  };

  const handleDeploy = () => {
    toast.success('Deploying your portfolio...');
    
    // Simulate deployment process
    setTimeout(() => {
      toast.success('Portfolio successfully deployed! It is now live at:', {
        description: portfolioUrl,
        action: {
          label: 'Visit',
          onClick: () => window.open(portfolioUrl, '_blank', 'noopener,noreferrer'),
        },
      });
    }, 3000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share your portfolio</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="embed">Embed</TabsTrigger>
            </TabsList>
            <TabsContent value="link" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input 
                  value={portfolioUrl} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={handleCopyLink}
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={() => window.open(portfolioUrl, '_blank')}
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="social" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => handleShare('linkedin')} className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
                <Button variant="outline" onClick={() => handleShare('twitter')} className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button variant="outline" onClick={() => handleShare('facebook')} className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button variant="outline" onClick={() => handleShare('email')} className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Email
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="embed" className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Add this code to your website to embed your portfolio:</p>
                <div className="relative">
                  <div className="bg-gray-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                    {`<iframe src="${portfolioUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute top-2 right-2"
                    onClick={() => {
                      navigator.clipboard.writeText(`<iframe src="${portfolioUrl}" width="100%" height="600" frameborder="0"></iframe>`);
                      toast.success('Embed code copied to clipboard!');
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download portfolio</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button variant="outline" onClick={() => handleDownload('pdf')} className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download as PDF
            </Button>
            <Button variant="outline" onClick={() => handleDownload('html')} className="justify-start">
              <Code className="h-4 w-4 mr-2" />
              Download as HTML/CSS
            </Button>
            <Button variant="outline" onClick={() => handleDownload('json')} className="justify-start">
              <Code className="h-4 w-4 mr-2" />
              Export as JSON data
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button onClick={handleDeploy} className="flex items-center gap-2">
        <ExternalLink className="h-4 w-4" />
        Deploy Portfolio
      </Button>
    </div>
  );
};

export default PortfolioActions;
