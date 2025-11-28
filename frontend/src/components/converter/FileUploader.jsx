import React, { useRef, useState } from 'react';
import { Upload, FileUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';

export const FileUploader = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff', 'image/x-icon', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  const maxFileSize = 2 * 1024 * 1024 * 1024; // 2GB

  const validateFiles = (files) => {
    const validFiles = [];
    const errors = [];

    Array.from(files).forEach((file) => {
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: Dosya boyutu 2GB'den büyük olamaz`);
      } else if (!supportedFormats.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|gif|tiff|ico|pdf|docx|doc)$/i)) {
        errors.push(`${file.name}: Desteklenmeyen dosya formatı`);
      } else {
        validFiles.push(file);
      }
    });

    return { validFiles, errors };
  };

  const handleFiles = (files) => {
    const { validFiles, errors } = validateFiles(files);

    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
      toast.success(`${validFiles.length} dosya yüklendi`);
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={`relative p-12 border-2 border-dashed cursor-pointer transition-smooth hover:border-primary/50 hover:bg-primary/5 ${
        isDragging ? 'drag-over border-primary bg-primary/10 scale-[1.01]' : 'border-border'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.gif,.tiff,.ico,.pdf,.docx,.doc"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Dosya seç"
      />

      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
          <Upload className="h-8 w-8" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Dosyaları buraya sürükleyin
          </h3>
          <p className="text-muted-foreground mb-4">
            veya tıklayarak dosya seçin
          </p>
        </div>

        <Button type="button" size="lg" className="pointer-events-none">
          <FileUp className="mr-2 h-5 w-5" />
          Dosya Seç
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Desteklenen formatlar: JPEG, PNG, WEBP, ICO, GIF, TIFF, PDF, DOCX, DOC</p>
          <p>Maksimum dosya boyutu: 2GB</p>
        </div>
      </div>
    </Card>
  );
};

export default FileUploader;
