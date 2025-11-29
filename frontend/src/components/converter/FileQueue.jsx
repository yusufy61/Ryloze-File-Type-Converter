import React from 'react';
import { Play, X, Download, RotateCcw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

export const FileQueue = ({
  files,
  selectedFile,
  onFileSelect,
  onFileUpdate,
  onFileRemove,
  onStartConversion,
  onStartAll,
  onCancelAll,
  onDownload,
}) => {
  const formatOptions = {
    image: ['JPEG', 'PNG', 'WEBP', 'ICO', 'GIF', 'TIFF', 'PDF'],
    document: ['PDF', 'DOCX'],
  };

  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.includes('document') || file.type.includes('pdf')) return 'document';
    return 'other';
  };

  const getAvailableFormats = (file) => {
    const fileType = getFileType(file);
    if (fileType === 'image') return formatOptions.image;
    if (fileType === 'document') return formatOptions.document;
    return [];
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleRetry = (file) => {
    onFileUpdate(file.id, { status: 'queued', progress: 0 });
    onStartConversion(file.id);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      uploading: { label: 'Yükleniyor', variant: 'default', icon: Loader2 },
      queued: { label: 'Sırada', variant: 'secondary', icon: null },
      processing: { label: 'İşleniyor', variant: 'default', icon: Loader2 },
      completed: { label: 'Tamamlandı', variant: 'success', icon: CheckCircle2 },
      failed: { label: 'Başarısız', variant: 'destructive', icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig.queued;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="text-xs">
        {Icon && (
          <Icon
            className={`mr-1 h-3 w-3 ${
              status === 'processing' || status === 'uploading' ? 'animate-spin' : ''
            }`}
          />
        )}
        {config.label}
      </Badge>
    );
  };

  if (files.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">Henüz dosya yüklenmedi</p>
          <p className="text-sm">Yukarıdaki alana dosyalarınızı sürükleyin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Dosya Kuyruğu</h3>
          <p className="text-sm text-muted-foreground">{files.length} dosya</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={onStartAll}
            disabled={files.every((f) => f.status !== 'queued' || !f.outputFormat)}
          >
            <Play className="mr-2 h-4 w-4" />
            Tümünü Başlat
          </Button>
          <Button size="sm" variant="outline" onClick={onCancelAll}>
            <X className="mr-2 h-4 w-4" />
            Tümünü İptal Et
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className={`p-4 rounded-lg border-2 transition-smooth cursor-pointer ${
              selectedFile?.id === file.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30 hover:bg-muted/50'
            }`}
            onClick={() => onFileSelect(file)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  {getStatusBadge(file.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{formatFileSize(file.size)}</p>

                {/* Format Selection */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Çıktı formatı:</span>
                  <Select
                    value={file.outputFormat}
                    onValueChange={(value) => onFileUpdate(file.id, { outputFormat: value })}
                    disabled={['processing', 'completed', 'uploading'].includes(file.status)}
                  >
                    <SelectTrigger className="h-8 text-xs w-[120px]">
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableFormats(file).map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Progress Bar */}
                {['processing', 'uploading'].includes(file.status) && (
                  <div className="space-y-1">
                    <Progress value={file.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">%{Math.round(file.progress)}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1">
                {file.status === 'queued' && file.outputFormat && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartConversion(file.id);
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                {file.status === 'completed' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(file);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {file.status === 'failed' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRetry(file);
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove(file.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FileQueue;
