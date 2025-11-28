import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FileUploader from '../components/converter/FileUploader';
import FileQueue from '../components/converter/FileQueue';
import ConversionOptions from '../components/converter/ConversionOptions';

export const ConverterPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFilesAdded = (newFiles) => {
    const filesWithMetadata = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'queued', // queued, processing, completed, failed
      progress: 0,
      outputFormat: '',
      options: {},
    }));
    setFiles((prev) => [...prev, ...filesWithMetadata]);
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

  const handleStartConversion = (fileId) => {
    // Mock conversion process
    handleFileUpdate(fileId, { status: 'processing', progress: 0 });
    
    // Simulate progress
    const interval = setInterval(() => {
      setFiles((prev) => {
        const file = prev.find((f) => f.id === fileId);
        if (!file || file.progress >= 100) {
          clearInterval(interval);
          if (file) {
            handleFileUpdate(fileId, { status: 'completed', progress: 100 });
          }
          return prev;
        }
        return prev.map((f) =>
          f.id === fileId ? { ...f, progress: Math.min(f.progress + 10, 100) } : f
        );
      });
    }, 200);
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
            <FileUploader onFilesAdded={handleFilesAdded} />
            <FileQueue
              files={files}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onFileUpdate={handleFileUpdate}
              onFileRemove={handleFileRemove}
              onStartConversion={handleStartConversion}
              onStartAll={handleStartAll}
              onCancelAll={handleCancelAll}
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
