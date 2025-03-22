
import { useState, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  existingImage?: string;
  className?: string;
  label?: string;
  acceptedFormats?: string;
}

const ImageUpload = ({
  onImageUpload,
  existingImage,
  className = '',
  label = 'Upload Image',
  acceptedFormats = '.jpg,.jpeg'
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.includes('image/jpeg')) {
      toast({
        title: "Invalid file format",
        description: "Please upload only JPG or JPEG images",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate upload with loading state
    setIsUploading(true);
    
    // Create URL for preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      
      // Simulate upload delay
      setTimeout(() => {
        onImageUpload(result);
        setIsUploading(false);
        
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        });
      }, 1000);
    };
    
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUpload('');
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input 
        type="file"
        ref={fileInputRef}
        accept={acceptedFormats}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-md"
          />
          <button
            onClick={handleClearImage}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <Button
          onClick={handleButtonClick}
          variant="outline"
          className="w-full h-32 border-dashed border-2 flex flex-col items-center justify-center gap-2"
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">JPG, JPEG formats only</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
