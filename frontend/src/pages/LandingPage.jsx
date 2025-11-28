import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Shield, Zap, FileImage, FileText, Check, ArrowRight, Star } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export const LandingPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Hızlı Dönüştürme',
      description: 'Gelişmiş altyapımız sayesinde dosyalarınızı saniyeler içinde dönüştürün.',
    },
    {
      icon: Shield,
      title: 'Güvenli İşlem',
      description: 'Dosyalarınız şifrelenir ve 24 saat sonra otomatik olarak silinir.',
    },
    {
      icon: FileImage,
      title: 'Çoklu Format',
      description: 'JPEG, PNG, WEBP, PDF, DOCX ve daha fazla format desteği.',
    },
  ];

  const supportedFormats = [
    { name: 'JPEG', color: 'bg-primary' },
    { name: 'PNG', color: 'bg-accent' },
    { name: 'WEBP', color: 'bg-primary' },
    { name: 'PDF', color: 'bg-destructive' },
    { name: 'DOCX', color: 'bg-accent' },
    { name: 'ICO', color: 'bg-primary' },
    { name: 'GIF', color: 'bg-accent' },
    { name: 'TIFF', color: 'bg-primary' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Dosya Yükle',
      description: 'Dosyalarınızı sürükleyip bırakın veya seçin',
    },
    {
      number: '02',
      title: 'Format Seç',
      description: 'Hedef formatı ve ayarları belirleyin',
    },
    {
      number: '03',
      title: 'İndir',
      description: 'Dönüştürülmüş dosyanızı hemen indirin',
    },
  ];

  const testimonials = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Grafik Tasarımcı',
      content: 'Günlük işlerimde sürekli kullanıyorum. Hem hızlı hem de güvenilir!',
      rating: 5,
    },
    {
      name: 'Elif Demir',
      role: 'İçerik Üreticisi',
      content: 'Toplu dönüştürme özelliği sayesinde çok zaman kazanıyorum.',
      rating: 5,
    },
    {
      name: 'Mehmet Kaya',
      role: 'Web Geliştirici',
      content: 'API entegrasyonu mükemmel. Projelerimde kullanmak çok kolay.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 animate-slide-up">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow"></div>
              <span className="text-sm font-medium text-primary">Profesyonel Dosya Dönüştürme Platformu</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
              Dosyalarınızı{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Hızla Dönüştürün
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              JPEG, PNG, WEBP, ICO, PDF, DOCX ve daha fazla format desteği. Güvenli, hızlı ve kolay kullanım.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up">
              <Link to="/converter">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-smooth group">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto transition-smooth">
                  Fiyatları Görüntüle
                </Button>
              </Link>
            </div>

            {/* Supported Formats */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {supportedFormats.map((format) => (
                <Badge
                  key={format.name}
                  variant="secondary"
                  className="px-3 py-1.5 font-medium transition-smooth hover:scale-105"
                >
                  {format.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Üç basit adımda dosyalarınızı dönüştürün
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <Card className="p-8 h-full border-2 hover:border-primary/50 transition-smooth hover:shadow-lg">
                  <div className="text-6xl font-bold text-primary/10 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Neden Ryloze?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profesyonel özellikleriyle öne çıkıyoruz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="p-8 hover:shadow-xl transition-smooth border-2 hover:border-primary/30">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Kullanıcılarımız Ne Diyor?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Binlerce mutlu kullanıcıdan bazıları
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6 hover:shadow-lg transition-smooth">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="mt-auto">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto p-12 text-center border-2 border-primary/20 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Hemen Dönüştürmeye Başlayın
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ücretsiz hesap oluşturun ve günlük limitlerinizi kullanmaya başlayın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/converter">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-smooth">
                  Ücretsiz Başla
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto transition-smooth">
                  Premium'a Geç
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-success" />
                <span>Kredi kartı gerekmez</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-success" />
                <span>24 saat içinde silinir</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
