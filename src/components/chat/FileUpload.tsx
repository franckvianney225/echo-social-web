
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, Image, Video } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const triggerFileInput = (accept?: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept || '*/*';
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-64 shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => triggerFileInput('image/*')}
          >
            <Image className="w-4 h-4 mr-2" />
            Photos
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => triggerFileInput('video/*')}
          >
            <Video className="w-4 h-4 mr-2" />
            Videos
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => triggerFileInput('.pdf,.doc,.docx,.txt')}
          >
            <File className="w-4 h-4 mr-2" />
            Documents
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => triggerFileInput()}
          >
            <Upload className="w-4 h-4 mr-2" />
            All Files
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </CardContent>
    </Card>
  );
};

export default FileUpload;
