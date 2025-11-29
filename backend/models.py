"""
Data models for file conversion operations
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid

class StatusCheck(BaseModel):
    """Status check model"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    """Create status check request"""
    client_name: str

class ConversionRequest(BaseModel):
    """Request model for file conversion"""
    file_id: str
    original_filename: str
    file_type: str  # 'image' or 'document'
    target_format: str
    options: Dict[str, Any] = Field(default_factory=dict)

class ConversionResponse(BaseModel):
    """Response model for conversion status"""
    conversion_id: str
    file_id: str
    original_filename: str
    target_format: str
    status: str  # 'pending', 'processing', 'completed', 'failed'
    progress: int = 0
    message: str
    output_file_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class ConversionHistory(BaseModel):
    """Store conversion history in database"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    original_filename: str
    original_size: int
    file_type: str
    input_format: str
    output_format: str
    output_filename: Optional[str] = None
    output_size: Optional[int] = None
    status: str  # 'completed', 'failed'
    error_message: Optional[str] = None
    conversion_time_ms: int = 0
    options: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UploadResponse(BaseModel):
    """Response model for file upload"""
    file_id: str
    filename: str
    file_type: str
    size: int
    mime_type: str
    message: str
    status: str  # 'success' or 'error'

class DownloadRequest(BaseModel):
    """Request model for file download"""
    file_id: str
    filename: str

class ConversionResponse(BaseModel):
    """Response model for conversion status"""
    conversion_id: str
    file_id: str
    original_filename: str
    target_format: str
    status: str  # 'pending', 'processing', 'completed', 'failed'
    progress: int = 0
    message: str
    output_file_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class ConversionHistory(BaseModel):
    """Store conversion history in database"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    original_filename: str
    original_size: int
    file_type: str
    input_format: str
    output_format: str
    output_filename: Optional[str] = None
    output_size: Optional[int] = None
    status: str  # 'completed', 'failed'
    error_message: Optional[str] = None
    conversion_time_ms: int = 0
    options: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UploadResponse(BaseModel):
    """Response model for file upload"""
    file_id: str
    filename: str
    file_type: str
    size: int
    mime_type: str
    message: str
    status: str  # 'success' or 'error'

class DownloadRequest(BaseModel):
    """Request model for file download"""
    file_id: str
    filename: str
