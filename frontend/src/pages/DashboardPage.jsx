import React, { useState } from 'react';
import { Calendar, Download, Filter, Search, FileText, Trash2, Eye } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const conversionHistory = [
    {
      id: 1,
      date: '2024-01-15',
      time: '14:30',
      inputFile: 'dokuman.docx',
      outputFile: 'dokuman.pdf',
      inputFormat: 'DOCX',
      outputFormat: 'PDF',
      size: '2.4 MB',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '13:15',
      inputFile: 'logo.png',
      outputFile: 'logo.webp',
      inputFormat: 'PNG',
      outputFormat: 'WEBP',
      size: '856 KB',
      status: 'completed',
    },
    {
      id: 3,
      date: '2024-01-14',
      time: '16:45',
      inputFile: 'rapor.pdf',
      outputFile: 'rapor.docx',
      inputFormat: 'PDF',
      outputFormat: 'DOCX',
      size: '1.2 MB',
      status: 'completed',
    },
    {
      id: 4,
      date: '2024-01-14',
      time: '11:20',
      inputFile: 'fotograf.jpg',
      outputFile: 'fotograf.png',
      inputFormat: 'JPEG',
      outputFormat: 'PNG',
      size: '3.1 MB',
      status: 'failed',
    },
  ];

  const stats = [
    { label: 'Toplam Dönüştürme', value: '127', change: '+12%', trend: 'up' },
    { label: 'Bu Ay', value: '45', change: '+8%', trend: 'up' },
    { label: 'Başarı Oranı', value: '%98', change: '+2%', trend: 'up' },
    { label: 'Toplam Boyut', value: '2.4 GB', change: '-5%', trend: 'down' },
  ];

  const getStatusBadge = (status) => {
    const config = {
      completed: { label: 'Tamamlandı', variant: 'success' },
      failed: { label: 'Başarısız', variant: 'destructive' },
      processing: { label: 'İşleniyor', variant: 'default' },
    };

    const statusConfig = config[status] || config.completed;
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Kontrol Paneli</h1>
          <p className="text-muted-foreground">Dönüştürme geçmişiniz ve istatistikleriniz</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 hover:shadow-lg transition-smooth">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-success' : 'text-muted-foreground'
                  }`}
                >
                  {stat.change} son aya göre
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* API Token Section */}
        <Card className="p-6 mb-8 border-2 border-accent/20 bg-accent/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">API Erişimi</h3>
              <p className="text-sm text-muted-foreground">
                API anahtarinizi oluşturun ve uygulamalariniza entegre edin
              </p>
            </div>
            <Button variant="outline">
              API Token Oluştur
            </Button>
          </div>
        </Card>

        {/* Conversion History */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Dönüştürme Geçmişi</h2>
              <p className="text-sm text-muted-foreground">Son dönüştürmelerinizi görüntüleyin</p>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ara..."
                  className="pl-9 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                  <SelectItem value="failed">Başarısız</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih & Saat</TableHead>
                  <TableHead>Giriş Dosyası</TableHead>
                  <TableHead>Dönüşüm</TableHead>
                  <TableHead>Boyut</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversionHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{item.date}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.inputFile}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.inputFormat}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.outputFormat}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{item.size}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {item.status === 'completed' && (
                          <>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
