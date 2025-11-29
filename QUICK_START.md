# 🚀 Başlama Rehberi - Ryloze Converter

## ⚡ 5 Dakikalık Quick Start

### Adım 1: Backend Başlat (Terminal 1)
```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Bağımlılıkları yükle
pip install -r requirements.txt

# Backend'i çalıştır
uvicorn server:app --reload
```

✅ Backend çalışıyor: `http://localhost:8000`

### Adım 2: Frontend Başlat (Terminal 2)
```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Frontend'i çalıştır
npm start
```

✅ Frontend açılacak: `http://localhost:3000`

### Adım 3: Uygulamayı Test Et
1. `http://localhost:3000` adresini ziyaret et
2. Bir görüntü dosyası yükle
3. Çıkış formatı seç (PNG, JPEG, vb.)
4. "Başlat" butonuna tıkla
5. Dönüştürülen dosyayı indir

---

## 📋 Sistem Gereksinimleri

```
✅ Python 3.8+
✅ Node.js 14+
✅ MongoDB (yerel veya bulut)
✅ 2GB+ disk alanı
✅ İnternet bağlantısı
```

---

## 🐳 Docker ile Başla (Optional)

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f

# Hepsini durdur
docker-compose down
```

---

## 🔍 API Endpoints

### Sağlık Kontrolü
```bash
curl http://localhost:8000/api/health
```

### Dosya Yükle
```bash
curl -X POST -F "file=@image.jpg" \
  http://localhost:8000/api/upload
```

### Dönüştürme Başlat
```bash
curl -X POST http://localhost:8000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "abc123",
    "original_filename": "image.jpg",
    "file_type": "image",
    "target_format": "PNG",
    "options": {"quality": 90}
  }'
```

### İlerleme Kontrol
```bash
curl http://localhost:8000/api/convert/status/conv-xyz789
```

### Dosya İndir
```bash
curl http://localhost:8000/api/download/output-123 \
  -o converted.png
```

---

## 🧪 Kapı Test Etme

### Backend API Docs
```
http://localhost:8000/docs
```

### Health Check
```bash
# Terminal'de çalıştır
curl http://localhost:8000/api/health

# Beklenen cevap:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 📝 Desteklenen Dönüştürmeler

### Görüntüler
```
✅ JPEG ↔ PNG ↔ WebP ↔ GIF ↔ TIFF ↔ ICO ↔ BMP
✅ Kalite ayarı (1-100)
✅ Yeniden boyutlandırma
```

### Belgeler
```
✅ DOCX ↔ PDF
✅ DOC → PDF
```

---

## 🔧 Ortam Değişkenleri

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=converter_db
CORS_ORIGINS=http://localhost:3000
UPLOAD_DIR=./uploads
CONVERTED_DIR=./converted
MAX_FILE_SIZE=2147483648
DEBUG=true
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_DEBUG=true
```

---

## ❌ Sorun Giderme

### MongoDB Bağlantı Hatası
```bash
# MongoDB'yi başlat
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows: Services'ten başlat
```

### CORS Hatası
```
✅ .env dosyasında CORS_ORIGINS kontrol et
✅ Frontend URL'si doğru mu?
```

### Port Zaten Kullanımda
```bash
# Backend portunu değiştir
uvicorn server:app --reload --port 8001

# Frontend portunu değiştir
PORT=3001 npm start
```

### Bağımlılık Hatası
```bash
# Tamamen temizle ve yeniden yükle
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

---

## 📚 Detaylı Belgeler

1. **SETUP.md** - Detaylı kurulum ve API dokümantasyonu
2. **ARCHITECTURE.md** - Teknik mimarisi ve veri akışı
3. **COMPLETION_REPORT.md** - Tamamlama raporu

---

## 🎯 İlk Kullanım Adımları

```
1. Backend'i başlat → http://localhost:8000/docs
2. Frontend'i başlat → http://localhost:3000
3. Bir dosya yükle
4. Format seç
5. Dönüştürme başlat
6. İndir
```

---

## 💻 Geliştirme Modunda Çalışma

### Backend Development
```bash
# Hot reload ile
uvicorn server:app --reload

# Debug mode'de
uvicorn server:app --reload --log-level debug
```

### Frontend Development
```bash
# Hot reload ile
npm start

# Production build
npm run build
```

---

## 🚀 Production Dağıtımı

### Backend
```bash
# Gunicorn kullan
pip install gunicorn
gunicorn server:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend
```bash
# Production build yap
npm run build

# Serve et
npm install -g serve
serve -s build
```

### Docker
```bash
# Build ve run
docker-compose up -d --build

# Monitor
docker-compose logs -f
```

---

## 📊 Performans İpuçları

1. **Caching**: Redis ekleyin
2. **Async**: Celery + RabbitMQ kullanın
3. **CDN**: Dosyaları CDN'e aktarın
4. **Compression**: gzip aktif edin
5. **Indexing**: Database'i optimize edin

---

## 🔒 Güvenlik Kontrol Listesi

- [ ] JWT authentication ekle
- [ ] Rate limiting ayarla
- [ ] HTTPS etkinleştir
- [ ] Virus scanning ekle
- [ ] Encryption-at-rest ayarla
- [ ] Audit logging aktif et
- [ ] CORS'u restrict et

---

## 📞 Yardım ve Destek

### Sık Sorulan Sorular

**S: Dosya yükleme başarısız?**
A: Dosya boyutunu (2GB) ve formatını kontrol et

**S: MongoDB bağlantısı yok?**
A: MongoDB'nin çalıştığından emin ol ve connection string'i kontrol et

**S: Dönüştürme çok yavaş?**
A: Dosya boyutu kontrol et veya server kaynaklarını arttır

**S: CORS hatası alıyorum?**
A: Frontend URL'sinin .env dosyasında tanımlı olduğundan emin ol

---

## 📈 Sonraki Adımlar

1. ✅ Temel kurulum tamamlandı
2. 🎯 Tüm özellikler çalışıyor
3. 🔒 Security review yap
4. 📊 Performance testing yap
5. 🚀 Production dağıtımı yap

---

## 🎉 Tebrikler!

Ryloze Converter uygulamanız artık tamamen işlevsel ve production-ready durumdadır!

Daha fazla bilgi için belgeleri okuyun:
- 📖 SETUP.md - Detaylı rehber
- 🏗️ ARCHITECTURE.md - Teknik detaylar
- ✅ COMPLETION_REPORT.md - Tamamlama raporu

**Happy Converting! 🚀**

---

*Tarih: 28 Kasım 2024*
*Versiyon: 1.0.0*
*Durum: Production Ready ✅*
