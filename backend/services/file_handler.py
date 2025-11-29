"""
File handling service for uploading and managing files
"""
import os
import shutil
from pathlib import Path
from typing import Optional
import uuid
from datetime import datetime, timezone
import aiofiles

class FileHandler:
    def __init__(self, upload_dir: str, max_file_size: int):
        self.upload_dir = Path(upload_dir)
        self.max_file_size = max_file_size
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    async def validate_file(self, file_path: Path, file_type: str) -> tuple[bool, str]:
        """Validate uploaded file"""
        # Check if file exists
        if not file_path.exists():
            return False, "Dosya bulunamadı"
        
        # Check file size
        if file_path.stat().st_size > self.max_file_size:
            return False, f"Dosya boyutu {self.max_file_size / (1024*1024*1024):.0f}GB'den büyük olamaz"
        
        # Check file extension
        ext = file_path.suffix.lower()
        valid_extensions = {
            'image': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.ico', '.bmp'],
            'document': ['.pdf', '.doc', '.docx']
        }
        
        if ext not in valid_extensions.get(file_type, []):
            return False, f"Desteklenmeyen dosya uzantısı: {ext}"
        
        return True, "Dosya geçerli"
    
    async def save_upload(self, file_content: bytes, original_filename: str, file_type: str) -> tuple[bool, str, Optional[str]]:
        """Save uploaded file"""
        try:
            # Create a unique filename
            file_id = str(uuid.uuid4())
            file_ext = Path(original_filename).suffix
            unique_filename = f"{file_id}{file_ext}"
            
            # Create type-specific directory
            type_dir = self.upload_dir / file_type
            type_dir.mkdir(parents=True, exist_ok=True)
            
            file_path = type_dir / unique_filename
            
            # Write file
            async with aiofiles.open(str(file_path), 'wb') as f:
                await f.write(file_content)
            
            # Validate file
            is_valid, validation_msg = await self.validate_file(file_path, file_type)
            if not is_valid:
                os.remove(file_path)
                return False, validation_msg, None
            
            return True, "Dosya başarıyla kaydedildi", file_id
        except Exception as e:
            return False, f"Dosya kaydetme hatası: {str(e)}", None
    
    def get_file_path(self, file_id: str, file_type: str) -> Optional[Path]:
        """Get file path from file ID"""
        type_dir = self.upload_dir / file_type
        for file in type_dir.glob(f"{file_id}*"):
            if file.is_file():
                return file
        return None
    
    def delete_file(self, file_id: str, file_type: str) -> bool:
        """Delete file"""
        try:
            file_path = self.get_file_path(file_id, file_type)
            if file_path and file_path.exists():
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            print(f"Dosya silme hatası: {str(e)}")
            return False
    
    def cleanup_old_files(self, days: int = 7):
        """Clean up files older than specified days"""
        try:
            import time
            cutoff_time = time.time() - (days * 24 * 60 * 60)
            
            for root, dirs, files in os.walk(self.upload_dir):
                for file in files:
                    file_path = Path(root) / file
                    if os.path.getmtime(file_path) < cutoff_time:
                        os.remove(file_path)
        except Exception as e:
            print(f"Eski dosyaları temizleme hatası: {str(e)}")
