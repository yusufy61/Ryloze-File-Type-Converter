import React from 'react';
import { Settings, Info } from 'lucide-react';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';

export const ConversionOptions = ({ selectedFile, onFileUpdate }) => {
  if (!selectedFile) {
    return (
      <Card className="p-8 h-full flex flex-col items-center justify-center text-center">
        <Settings className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">Ayarları görüntülemek için bir dosya seçin</p>
      </Card>
    );
  }

  const isImage = selectedFile.type.startsWith('image/');
  const isDocument = selectedFile.type.includes('document') || selectedFile.type.includes('pdf');

  const handleOptionChange = (key, value) => {
    onFileUpdate(selectedFile.id, {
      options: {
        ...selectedFile.options,
        [key]: value,
      },
    });
  };

  return (
    <Card className="p-6 sticky top-20">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Dönüştürme Ayarları</h3>
      </div>

      <div className="space-y-6">
        {/* File Info */}
        <div>
          <Label className="text-sm font-medium mb-2">Seçili Dosya</Label>
          <p className="text-sm text-muted-foreground truncate">{selectedFile.name}</p>
        </div>

        {/* Image Specific Options */}
        {isImage && (
          <>
            {/* Quality */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Kalite</Label>
                <span className="text-sm text-muted-foreground">
                  {selectedFile.options.quality || 90}%
                </span>
              </div>
              <Slider
                value={[selectedFile.options.quality || 90]}
                onValueChange={(value) => handleOptionChange('quality', value[0])}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Resize */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Yeniden Boyutlandır</Label>
                <Switch
                  checked={selectedFile.options.resize || false}
                  onCheckedChange={(checked) => handleOptionChange('resize', checked)}
                />
              </div>
              {selectedFile.options.resize && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1">Genişlik (px)</Label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                      placeholder="800"
                      value={selectedFile.options.width || ''}
                      onChange={(e) => handleOptionChange('width', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1">Yükseklik (px)</Label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                      placeholder="600"
                      value={selectedFile.options.height || ''}
                      onChange={(e) => handleOptionChange('height', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Compression */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Sıkıştırma</Label>
                <p className="text-xs text-muted-foreground">Dosya boyutunu küçült</p>
              </div>
              <Switch
                checked={selectedFile.options.compress || false}
                onCheckedChange={(checked) => handleOptionChange('compress', checked)}
              />
            </div>
          </>
        )}

        {/* Document Specific Options */}
        {isDocument && selectedFile.outputFormat === 'PDF' && (
          <>
            {/* Page Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sayfa Boyutu</Label>
              <Select
                value={selectedFile.options.pageSize || 'A4'}
                onValueChange={(value) => handleOptionChange('pageSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="A3">A3</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Yönelim</Label>
              <Select
                value={selectedFile.options.orientation || 'portrait'}
                onValueChange={(value) => handleOptionChange('orientation', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Dikey</SelectItem>
                  <SelectItem value="landscape">Yatay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Info Alert */}
        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Dönüştürme işlemi tamamlandıktan sonra dosyanız 24 saat içinde sunucularımızdan otomatik olarak silinir.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
};

export default ConversionOptions;
