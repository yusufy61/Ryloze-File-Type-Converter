import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FileUploader from '../components/converter/FileUploader';
import FileQueue from '../components/converter/FileQueue';
import ConversionOptions from '../components/converter/ConversionOptions';
import { toast } from 'sonner';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const ConverterPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Dosya yükleme işlemi
  const handleFilesAdded = async (newFiles) => {
    setIsUploading(true);
    
    const filesWithMetadata = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      outputFormat: '',
      options: {},
      fileId: null,
      conversionId: null,
    }));
    
    setFiles((prev) => [...prev, ...filesWithMetadata]);

    // Backend'e yükle
    for (const fileMetadata of filesWithMetadata) {
      try {
        const formData = new FormData();
        formData.append('file', fileMetadata.file);

        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        let data;
        try {
          data = await response.json();
        } catch (e) {
          throw new Error('Sunucudan hatalı cevap alındı');
        }

        if (!response.ok) {
          throw new Error(data.detail || 'Yükleme başarısız');
        }
        
        handleFileUpdate(fileMetadata.id, {
          status: 'queued',
          progress: 100,
          fileId: data.file_id,
        });
        
        toast.success(`${fileMetadata.name} başarıyla yüklendi`);
      } catch (error) {
        handleFileUpdate(fileMetadata.id, {
          status: 'failed',
          progress: 0,
        });
        toast.error(`${fileMetadata.name} yükleme hatası: ${error.message}`);
      }
    }

    setIsUploading(false);
  };

  const handleFileUpdate = (fileId, updates) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f))
    );
  };

  const handleFileRemove = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  // Dönüştürme işlemini başlat
  const handleStartConversion = (fileId) => {
    const file = files.find((f) => f.id === fileId);
    
    if (!file.fileId) {
      toast.error('Dosya henüz yüklenmedi');
      return;
    }

    if (!file.outputFormat) {
      toast.error('Lütfen çıkış formatını seçin');
      return;
    }

    // Backend'e dönüştürme isteği gönder
    performConversion(file);
  };

  const performConversion = async (file) => {
    try {
      handleFileUpdate(file.id, { status: 'processing', progress: 0 });

      const response = await fetch(`${API_BASE_URL}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: file.fileId,
          original_filename: file.name,
          file_type: file.type.startsWith('image/') ? 'image' : 'document',
          target_format: file.outputFormat,
          options: file.options,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Sunucudan hatalı cevap alındı');
      }

      if (!response.ok) {
        throw new Error(data.detail || 'Dönüştürme başarısız');
      }

      const conversionId = data.conversion_id;

      handleFileUpdate(file.id, { conversionId });

      // Progress'i takip et
      monitorConversion(file.id, conversionId);
    } catch (error) {
      handleFileUpdate(file.id, {
        status: 'failed',
        progress: 0,
      });
      toast.error(`Dönüştürme hatası: ${error.message}`);
    }
  };

  // Dönüştürme ilerleme takibi
  const monitorConversion = (fileId, conversionId) => {
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/convert/status/${conversionId}`
        );

        if (!response.ok) {
          throw new Error('Status check failed');
        }

        const data = await response.json();

        handleFileUpdate(fileId, {
          status: data.status,
          progress: data.progress,
          outputFileId: data.output_file_id,
        });

        if (data.status === 'completed') {
          clearInterval(checkInterval);
          toast.success('Dosya başarıyla dönüştürüldü!');
        } else if (data.status === 'failed') {
          clearInterval(checkInterval);
          toast.error(`Dönüştürme hatası: ${data.message}`);
        }
      } catch (error) {
        clearInterval(checkInterval);
        toast.error('Progress takibi hatası');
      }
    }, 1000); // Her 1 saniyede bir kontrol et
  };

  // Dosya indirme
  const handleDownload = async (file) => {
    try {
      if (file.status !== 'completed') {
        toast.error('Dosya henüz dönüştürülmedi');
        return;
      }

      if (!file.outputFileId) {
        toast.error('İndirme linki bulunamadı');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/download/${file.outputFileId}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('İndirme başarısız');
      }

      // Dosyayı indir
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.split('.')[0]}.${file.outputFormat.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Dosya indirildi');
    } catch (error) {
      toast.error(`İndirme hatası: ${error.message}`);
    }
  };

  const handleStartAll = () => {
    files.forEach((file) => {
      if (file.status === 'queued' && file.outputFormat) {
        handleStartConversion(file.id);
      }
    });
  };

  const handleCancelAll = () => {
    setFiles([]);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Dosya Dönüştürücü
          </h1>
          <p className="text-muted-foreground">
            Dosyalarınızı yükleyin ve istediğiniz formata dönüştürün
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Uploader & Queue */}
          <div className="lg:col-span-2 space-y-6">
            <FileUploader 
              onFilesAdded={handleFilesAdded}
              disabled={isUploading}
            />
            <FileQueue
              files={files}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onFileUpdate={handleFileUpdate}
              onFileRemove={handleFileRemove}
              onStartConversion={handleStartConversion}
              onStartAll={handleStartAll}
              onCancelAll={handleCancelAll}
              onDownload={handleDownload}
            />
          </div>

          {/* Right Column - Options */}
          <div className="lg:col-span-1">
            <ConversionOptions
              selectedFile={selectedFile}
              onFileUpdate={handleFileUpdate}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConverterPage;

