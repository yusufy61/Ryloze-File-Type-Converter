# Ryloze Converter - Kurulum ve Çalıştırma Rehberi

## Genel Bakış

Ryloze Converter, dosyaları çeşitli formatlara dönüştüren bir web uygulamasıdır. 
- **Backend**: FastAPI + Python
- **Frontend**: React + TailwindCSS
- **Database**: MongoDB
- **Depolama**: Disk veya S3

## Sistem Gereksinimleri

- Python 3.8+
- Node.js 14+
- MongoDB (yerel veya bulut)
- 2GB+ disk alanı (dosya depolama için)

## Backend Kurulumu

### 1. Python Ortamını Hazırlayın

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Bağımlılıkları Yükleyin

```bash
pip install -r requirements.txt
```

### 3. Ortam Değişkenlerini Yapılandırın

`.env` dosyasını kontrol edin ve gerekli değişkenleri ayarlayın:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=converter_db
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
UPLOAD_DIR=./uploads
CONVERTED_DIR=./converted
MAX_FILE_SIZE=2147483648
DEBUG=true
```

### 4. Backend'i Çalıştırın

```bash
uvicorn server:app --reload --port 8000
```

Backend şu adresde çalışacaktır: `http://localhost:8000`

API belgeleri: `http://localhost:8000/docs`

## Frontend Kurulumu

### 1. Bağımlılıkları Yükleyin

```bash
cd frontend
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Frontend'i Çalıştırın

```bash
npm start
```

Frontend şu adresde açılacaktır: `http://localhost:3000`

## Backend API Endpoint'leri

### Sağlık Kontrolleri

#### GET /api/health
Servislerin durumunu kontrol et

**Cevap:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Dosya Yükleme

#### POST /api/upload
Dosya yükle

**Request:**
```
Content-Type: multipart/form-data
Body: file (binary)
```

**Cevap:**
```json
{
  "file_id": "abc123def456",
  "filename": "image.jpg",
  "file_type": "image",
  "size": 2048576,
  "mime_type": "image/jpeg",
  "message": "Dosya başarıyla kaydedildi",
  "status": "success"
}
```

### Dönüştürme

#### POST /api/convert
Dosya dönüştürme işlemini başlat

**Request:**
```json
{
  "file_id": "abc123def456",
  "original_filename": "image.jpg",
  "file_type": "image",
  "target_format": "PNG",
  "options": {
    "quality": 90,
    "resize": false,
    "width": null,
    "height": null
  }
}
```

**Cevap:**
```json
{
  "conversion_id": "conv-xyz789",
  "status": "processing",
  "message": "Conversion started"
}
```

#### GET /api/convert/status/{conversion_id}
Dönüştürme durumunu kontrol et

**Cevap:**
```json
{
  "conversion_id": "conv-xyz789",
  "status": "processing|completed|failed",
  "progress": 50,
  "message": "Processing file...",
  "output_file_id": "output-123abc",
  "timestamp": "2024-01-15T10:31:00Z"
}
```

### İndirme

#### GET /api/download/{output_file_id}
Dönüştürülen dosyayı indir

**Cevap:** Dosya (binary)

## Desteklenen Dosya Formatları

### Görüntüler
- **Giriş**: JPEG, PNG, WebP, GIF, TIFF, ICO, BMP
- **Çıkış**: JPEG, PNG, WebP, ICO, GIF, TIFF, PDF, BMP

### Belgeler
- **Giriş**: PDF, DOCX, DOC
- **Çıkış**: PDF, DOCX

## Görüntü Dönüştürme Seçenekleri

```json
{
  "quality": 1-100,           // JPEG ve WebP kalitesi
  "resize": true/false,       // Yeniden boyutlandırma
  "width": 800,               // Genişlik (px)
  "height": 600               // Yükseklik (px)
}
```

## Veritabanı Şeması

### status_checks koleksiyonu
```json
{
  "_id": ObjectId,
  "id": "uuid",
  "client_name": "string",
  "timestamp": "ISO 8601 datetime"
}
```

### conversion_history koleksiyonu
```json
{
  "_id": ObjectId,
  "id": "uuid",
  "original_filename": "string",
  "file_type": "image|document",
  "input_format": "string",
  "output_format": "string",
  "output_filename": "string",
  "output_size": "number",
  "status": "completed|failed",
  "error_message": "string",
  "conversion_time_ms": "number",
  "options": "object",
  "created_at": "ISO 8601 datetime"
}
```

## Sorun Giderme

### CORS Hatası
Eğer CORS hatası alıyorsanız, `.env` dosyasında `CORS_ORIGINS` ayarını kontrol edin:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### MongoDB Bağlantı Hatası
MongoDB'nin çalıştığından emin olun:
```bash
# macOS (Homebrew kullanıyorsanız)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# MongoDB'yi Services'ten başlatın
```

### Dosya Yükleme Başarısız
- Dosya boyutunu kontrol edin (2GB maks.)
- Dosya formatının desteklendiğinden emin olun
- Disk alanı yeterli mi kontrol edin

### Dönüştürme Başarısız
- Backend loglarını kontrol edin
- Dosyanın bozuk olmadığını doğrulayın
- Gerekli kütüphanelerin yüklü olduğunu kontrol edin

## Performans Optimizasyonları

1. **Async İşleme**: Yüksek trafikli uygulamalar için Celery + Redis ekleyin
2. **Caching**: Redis kullanarak sık kullanılan dönüştürmeleri cache'leyin
3. **CDN**: Dönüştürülen dosyaları CDN'e aktarın
4. **Compression**: gzip compression'u aktif edin

## Güvenlik Önerileri

1. **Dosya Validasyonu**: Tüm dosyaları MIME type ve imza doğrulaması ile valide edin
2. **Rate Limiting**: IP başına istekleri sınırlandırın
3. **JWT Auth**: Kullanıcı kimlik doğrulaması ekleyin
4. **Encryption**: Hassas dosyaları şifreleyin
5. **Quarantine**: Şüpheli dosyaları izolasyonda tutun

## Production Dağıtımı

### Backend
```bash
# Gunicorn ile çalıştırın
gunicorn server:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend
```bash
# Production build
npm run build

# Serve with a static server
npm install -g serve
serve -s build
```

### Docker (Opsiyonel)
```bash
docker-compose up -d
```

## API Kullanım Örneği

```javascript
// 1. Dosya yükle
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:8000/api/upload', {
  method: 'POST',
  body: formData
});
const uploadData = await uploadResponse.json();
const fileId = uploadData.file_id;

// 2. Dönüştürme başlat
const convertResponse = await fetch('http://localhost:8000/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file_id: fileId,
    original_filename: 'image.jpg',
    file_type: 'image',
    target_format: 'PNG',
    options: { quality: 90 }
  })
});
const convertData = await convertResponse.json();
const conversionId = convertData.conversion_id;

// 3. İlerleme takibi
const statusResponse = await fetch(
  `http://localhost:8000/api/convert/status/${conversionId}`
);
const statusData = await statusResponse.json();
console.log(`Progress: ${statusData.progress}%`);

// 4. İndirme
if (statusData.status === 'completed') {
  const downloadUrl = `http://localhost:8000/api/download/${statusData.output_file_id}`;
  window.open(downloadUrl);
}
```

## Katkıda Bulunma

Katkılarınız hoş geldiniz! Lütfen pull request göndermeden önce testlerinizi yazın.

## Lisans

MIT License
