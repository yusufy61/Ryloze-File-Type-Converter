# API Reference Card - Ryloze Converter

## 🔗 API Base URL
```
http://localhost:8000/api
```

## 📡 Endpoints Özet

### Health & Status
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/` | Root endpoint |
| GET | `/health` | Sağlık durumu |
| POST | `/status` | Status check oluştur |
| GET | `/status` | Status checks listele |

### File Operations
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/upload` | Dosya yükle |
| POST | `/convert` | Dönüştürme başlat |
| GET | `/convert/status/{id}` | İlerleme takibi |
| GET | `/download/{id}` | Dosya indir |

---

## 📨 Detaylı Endpoints

### 1. GET /
**Açıklama**: Root endpoint

**Response**:
```json
{
  "message": "Ryloze Converter API",
  "version": "1.0.0",
  "status": "running"
}
```

---

### 2. GET /health
**Açıklama**: Sistem sağlığını kontrol et

**Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Status Kodları**:
- `200` ✅ Sistem sağlıklı
- `500` ❌ Sistem hatası

---

### 3. POST /upload
**Açıklama**: Dosya yükle

**Content-Type**: `multipart/form-data`

**Parameters**:
```
file: binary (required)
  - Max size: 2GB
  - Desteklenen formatlar: JPEG, PNG, WebP, GIF, TIFF, ICO, PDF, DOCX, DOC
```

**Response (200 OK)**:
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

**Error Response (400)**:
```json
{
  "detail": "Unsupported file type: application/pdf"
}
```

**Error Response (413)**:
```json
{
  "detail": "File size exceeds maximum allowed: 2GB"
}
```

---

### 4. POST /convert
**Açıklama**: Dosya dönüştürme işlemini başlat

**Content-Type**: `application/json`

**Request Body**:
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

**Parameters**:
```
file_id         (string, required) - Upload sonucu file_id
original_filename (string, required) - Orijinal dosya adı
file_type       (string, required) - "image" veya "document"
target_format   (string, required) - Hedef format
options         (object, optional) - Dönüştürme seçenekleri
  - quality     (1-100, görüntü için)
  - resize      (boolean)
  - width       (integer, px)
  - height      (integer, px)
```

**Response (200 OK)**:
```json
{
  "conversion_id": "conv-xyz789abc",
  "status": "processing",
  "message": "Conversion started"
}
```

**Error Response (400)**:
```json
{
  "detail": "Source file not found"
}
```

---

### 5. GET /convert/status/{conversion_id}
**Açıklama**: Dönüştürme işleminin durumunu kontrol et

**Path Parameters**:
```
conversion_id (string, required) - Dönüştürme ID'si
```

**Response (200 OK) - Processing**:
```json
{
  "conversion_id": "conv-xyz789abc",
  "status": "processing",
  "progress": 45,
  "message": "Processing file...",
  "output_file_id": null,
  "timestamp": "2024-01-15T10:31:00Z"
}
```

**Response (200 OK) - Completed**:
```json
{
  "conversion_id": "conv-xyz789abc",
  "status": "completed",
  "progress": 100,
  "message": "Image successfully converted",
  "output_file_id": "out-123abc",
  "timestamp": "2024-01-15T10:31:30Z"
}
```

**Response (200 OK) - Failed**:
```json
{
  "conversion_id": "conv-xyz789abc",
  "status": "failed",
  "progress": 0,
  "message": "Unsupported format conversion",
  "output_file_id": null,
  "timestamp": "2024-01-15T10:31:15Z"
}
```

**Status Values**:
- `pending` ⏳ Başlamak için beklemede
- `processing` ⚙️ İşleniyor
- `completed` ✅ Tamamlandı
- `failed` ❌ Başarısız

---

### 6. GET /download/{output_file_id}
**Açıklama**: Dönüştürülen dosyayı indir

**Path Parameters**:
```
output_file_id (string, required) - Çıkış dosya ID'si
```

**Response (200 OK)**:
```
[Binary File Data]
```

**Headers**:
```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="image.png"
```

**Error Response (404)**:
```json
{
  "detail": "File not found"
}
```

---

## 🧪 Test Komutları

### 1. Health Check
```bash
curl -X GET http://localhost:8000/api/health
```

### 2. Dosya Yükle
```bash
curl -X POST -F "file=@image.jpg" \
  http://localhost:8000/api/upload
```

### 3. Dönüştürme Başlat
```bash
curl -X POST http://localhost:8000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "abc123def456",
    "original_filename": "image.jpg",
    "file_type": "image",
    "target_format": "PNG",
    "options": {"quality": 90}
  }'
```

### 4. İlerleme Kontrol
```bash
curl -X GET http://localhost:8000/api/convert/status/conv-xyz789abc
```

### 5. Dosya İndir
```bash
curl -X GET http://localhost:8000/api/download/out-123abc \
  -o converted.png
```

---

## 💾 Request/Response Örnekleri

### Tam Flow (JavaScript)

```javascript
// 1. Dosya Yükle
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadRes = await fetch('http://localhost:8000/api/upload', {
  method: 'POST',
  body: formData
});
const uploadData = await uploadRes.json();
const fileId = uploadData.file_id;

// 2. Dönüştürme Başlat
const convertRes = await fetch('http://localhost:8000/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file_id: fileId,
    original_filename: uploadData.filename,
    file_type: 'image',
    target_format: 'PNG',
    options: { quality: 90 }
  })
});
const convertData = await convertRes.json();
const conversionId = convertData.conversion_id;

// 3. İlerleme Takibi
let completed = false;
while (!completed) {
  const statusRes = await fetch(
    `http://localhost:8000/api/convert/status/${conversionId}`
  );
  const statusData = await statusRes.json();
  
  console.log(`Progress: ${statusData.progress}%`);
  
  if (statusData.status === 'completed') {
    const outputFileId = statusData.output_file_id;
    
    // 4. Dosya İndir
    window.location.href = `http://localhost:8000/api/download/${outputFileId}`;
    completed = true;
  } else if (statusData.status === 'failed') {
    console.error('Conversion failed:', statusData.message);
    completed = true;
  }
  
  await new Promise(r => setTimeout(r, 1000)); // 1 saniye bekle
}
```

---

## 🔢 HTTP Status Kodları

| Kod | Anlamı | Örnek |
|-----|--------|-------|
| 200 | OK | Başarılı istek |
| 400 | Bad Request | Hatalı format |
| 404 | Not Found | Dosya bulunamadı |
| 413 | Payload Too Large | Dosya çok büyük |
| 422 | Validation Error | Validasyon hatası |
| 500 | Server Error | Sunucu hatası |

---

## 📊 Supported Formats

### Görüntü
```
Giriş:  JPEG, PNG, WebP, GIF, TIFF, ICO, BMP
Çıkış:  JPEG, PNG, WebP, ICO, GIF, TIFF, PDF, BMP
```

### Belge
```
Giriş:   PDF, DOCX, DOC
Çıkış:   PDF, DOCX
```

---

## ⚙️ Conversion Options

### Image Options
```json
{
  "quality": 1-100,        // JPEG/WebP kalitesi (default: 90)
  "resize": true/false,    // Boyutlandır? (default: false)
  "width": 800,            // Genişlik px (optional)
  "height": 600            // Yükseklik px (optional)
}
```

### Document Options
```json
{
  // Şu an seçenek yok - gelecekte eklenebilir
}
```

---

## 🔐 Authentication

Şu an kimlik doğrulama yok. Üretim ortamında ekleyin:

```bash
# Header'a JWT token ekle
Authorization: Bearer <token>
```

---

## 📈 Rate Limiting

Şu an rate limiting yok. Üretim ortamında ekleyin:

```
Default: 1000 requests per minute per IP
```

---

## 📝 Error Handling

### Generic Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "detail": "Additional details (if available)",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Errors

**CORS Error**
```
Çözüm: Backend CORS_ORIGINS'i kontrol et
```

**Connection Timeout**
```
Çözüm: Server çalışıyor mu kontrol et
```

**Invalid File Format**
```
Çözüm: Desteklenen formatlara göre dosya seç
```

---

## 🚀 Performance Tips

1. **Batch Processing**: Birden fazla dosya aynı anda yükleyin
2. **Polling Interval**: Status kontrol aralığını optimize et (1-3 saniye)
3. **Caching**: Sık dönüştürülen formatları cache'le
4. **Compression**: Large files için GZIP kullan

---

## 📞 API Versions

```
Current: 1.0.0
Base URL: http://localhost:8000/api
```

---

## 📚 Resources

- 📖 API Documentation: `http://localhost:8000/docs`
- 🔗 Swagger UI: `http://localhost:8000/redoc`
- 📝 [Setup Guide](./SETUP.md)
- 🏗️ [Architecture](./ARCHITECTURE.md)

---

*Last Updated: 28 Kasım 2024*
*API Version: 1.0.0*
