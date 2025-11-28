import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import Logo from '../common/Logo';

export const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Araçlar', href: '/converter' },
      { name: 'API', href: '#' },
      { name: 'Fiyatlandırma', href: '/pricing' },
      { name: 'Özellikler', href: '#' },
    ],
    company: [
      { name: 'Hakkımızda', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Kariyer', href: '#' },
      { name: 'İletişim', href: '#' },
    ],
    legal: [
      { name: 'Gizlilik Politikası', href: '#' },
      { name: 'Kullanım Koşulları', href: '#' },
      { name: 'Güvenlik', href: '#' },
      { name: 'KVKK', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Dosyalarınızı güvenli, hızlı ve kolay bir şekilde dönüştürün. Profesyonel çözümler sunuyoruz.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Ürün</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Şirket</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Yasal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Ryloze Converter. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow"></div>
                <span>Tüm sistemler çalışıyor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
