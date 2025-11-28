import React from 'react';
import { Check, Zap, Crown, Building2 } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export const PricingPage = () => {
  const plans = [
    {
      name: 'Ücretsiz',
      icon: Zap,
      price: '0',
      period: 'her zaman',
      description: 'Bireysel kullanıcılar için ideal',
      features: [
        'Günlük 10 dosya dönüştürme',
        'Maksimum 100MB dosya boyutu',
        'Temel format desteği',
        '24 saat dosya saklama',
        'E-posta desteği',
      ],
      limitations: [
        'API erişimi yok',
        'Toplu dönüştürme yok',
      ],
      cta: 'Hemen Başla',
      popular: false,
    },
    {
      name: 'Pro',
      icon: Crown,
      price: '99',
      period: 'ay',
      description: 'Profesyoneller ve küçük ekipler için',
      features: [
        'Günlük 500 dosya dönüştürme',
        'Maksimum 2GB dosya boyutu',
        'Tüm format desteği',
        '7 gün dosya saklama',
        'Öncelikli e-posta desteği',
        'API erişimi (10.000 istek/ay)',
        'Toplu dönüştürme',
        'Gelişmiş ayarlar',
        'Paralel dönüştürme',
      ],
      limitations: [],
      cta: 'Pro\'ya Geç',
      popular: true,
    },
    {
      name: 'Business',
      icon: Building2,
      price: '299',
      period: 'ay',
      description: 'Büyük ekipler ve kurumlar için',
      features: [
        'Sınırsız dosya dönüştürme',
        'Maksimum 10GB dosya boyutu',
        'Tüm format desteği',
        '30 gün dosya saklama',
        '7/24 öncelikli destek',
        'Sınırsız API erişimi',
        'Toplu dönüştürme',
        'Gelişmiş ayarlar',
        'Paralel dönüştürme',
        'Özel entegrasyonlar',
        'SLA garantisi',
        'Adanmış hesap yöneticisi',
      ],
      limitations: [],
      cta: 'İletişime Geç',
      popular: false,
    },
  ];

  const comparisonFeatures = [
    { name: 'Günlük dönüştürme limiti', free: '10', pro: '500', business: 'Sınırsız' },
    { name: 'Maksimum dosya boyutu', free: '100MB', pro: '2GB', business: '10GB' },
    { name: 'API erişimi', free: '✗', pro: '✓', business: '✓' },
    { name: 'Toplu dönüştürme', free: '✗', pro: '✓', business: '✓' },
    { name: 'Paralel dönüştürme', free: '✗', pro: '✓', business: '✓' },
    { name: 'Dosya saklama süresi', free: '24 saat', pro: '7 gün', business: '30 gün' },
    { name: 'Destek', free: 'E-posta', pro: 'Öncelikli', business: '7/24' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Size Uygun Planı{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Seçin
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bireysel kullanımdan kurumsal çözümlere kadar ihtiyacınıza uygun planlar. Her zaman yükseltebilir veya iptal edebilirsiniz.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card
                    key={plan.name}
                    className={`relative p-8 flex flex-col hover:shadow-xl transition-smooth ${
                      plan.popular
                        ? 'border-2 border-primary shadow-lg scale-105 md:scale-110'
                        : 'border-2 border-border'
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                        En Popüler
                      </Badge>
                    )}

                    <div className="flex items-center space-x-3 mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-xl text-muted-foreground">₺</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">/ {plan.period}</p>
                    </div>

                    <Button
                      size="lg"
                      className={`w-full mb-6 ${
                        plan.popular ? '' : 'variant-outline'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>

                    <div className="space-y-3 flex-1">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation) => (
                        <div key={limitation} className="flex items-start space-x-3 opacity-50">
                          <span className="text-muted-foreground text-sm ml-8">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 lg:py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Detaylı Karşılaştırma
              </h2>
              <p className="text-lg text-muted-foreground">
                Tüm planlari yan yana görüntüleyin
              </p>
            </div>

            <Card className="overflow-hidden max-w-5xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold text-foreground">Özellik</th>
                      <th className="text-center p-4 font-semibold text-foreground">Ücretsiz</th>
                      <th className="text-center p-4 font-semibold text-foreground bg-primary/5">Pro</th>
                      <th className="text-center p-4 font-semibold text-foreground">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={feature.name} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                        <td className="p-4 text-sm text-foreground">{feature.name}</td>
                        <td className="p-4 text-sm text-center text-muted-foreground">{feature.free}</td>
                        <td className="p-4 text-sm text-center font-medium bg-primary/5">{feature.pro}</td>
                        <td className="p-4 text-sm text-center text-muted-foreground">{feature.business}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Sorularınız mı var?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Sık sorulan sorular bölümüne göz atın veya bize ulaşın
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="outline">
                  SSS'yi Görüntüle
                </Button>
                <Button size="lg">
                  İletişime Geç
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
