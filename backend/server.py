from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
import time
import mimetypes

# Import services
from services.file_handler import FileHandler
from services.conversion_service import ConversionService
from models import (
    ConversionRequest, ConversionResponse, ConversionHistory,
    UploadResponse, StatusCheck, StatusCheckCreate
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ============ ENVIRONMENT VARIABLES ============
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'converter_db')
UPLOAD_DIR = os.environ.get('UPLOAD_DIR', str(ROOT_DIR / 'uploads'))
CONVERTED_DIR = os.environ.get('CONVERTED_DIR', str(ROOT_DIR / 'converted'))
MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE', 2147483648))  # 2GB
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
DEBUG = os.environ.get('DEBUG', 'true').lower() == 'true'

# ============ DATABASE SETUP ============
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ============ SERVICE INITIALIZATION ============
file_handler = FileHandler(UPLOAD_DIR, MAX_FILE_SIZE)
conversion_service = ConversionService(CONVERTED_DIR)

# ============ FASTAPI APP SETUP ============
app = FastAPI(
    title="Ryloze Converter API",
    description="File conversion service API",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ CORS MIDDLEWARE ============
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ LOGGING SETUP ============
logging.basicConfig(
    level=logging.DEBUG if DEBUG else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ GLOBAL STATE MANAGEMENT ============
# In-memory store for conversion jobs (for production, use Redis)
conversion_jobs: Dict[str, Dict[str, Any]] = {}

# ============ MODELS ============
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# ============ HEALTH CHECK ENDPOINTS ============
@api_router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Ryloze Converter API",
        "version": "1.0.0",
        "status": "running"
    }

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Try to connect to MongoDB
        await db.command('ping')
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
        logger.error(f"Database connection error: {e}")
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    """Create status check"""
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    """Get all status checks"""
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ============ FILE UPLOAD ENDPOINTS ============
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file for conversion"""
    try:
        logger.info(f"Uploading file: {file.filename}, content_type: {file.content_type}")
        
        # Determine file type by content-type or extension
        content_type = file.content_type or ""
        filename = file.filename or ""
        
        file_type = None
        if content_type.startswith('image/'):
            file_type = 'image'
        elif 'document' in content_type or 'pdf' in content_type or content_type.startswith('application/'):
            file_type = 'document'
        else:
            # Fallback to file extension
            ext = Path(filename).suffix.lower()
            if ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.ico', '.bmp']:
                file_type = 'image'
            elif ext in ['.pdf', '.docx', '.doc']:
                file_type = 'document'
        
        logger.info(f"Detected file_type: {file_type} for {filename}")
        
        if not file_type:
            logger.warning(f"Unsupported file type for {filename}: {content_type}")
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {content_type or 'unknown'}"
            )
        
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds maximum allowed: {MAX_FILE_SIZE / (1024**3):.0f}GB"
            )
        
        # Save file
        success, message, file_id = await file_handler.save_upload(
            content, file.filename, file_type
        )
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return UploadResponse(
            file_id=file_id,
            filename=file.filename,
            file_type=file_type,
            size=len(content),
            mime_type=file.content_type,
            message=message,
            status="success"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# ============ CONVERSION ENDPOINTS ============
@api_router.post("/convert")
async def start_conversion(
    request: ConversionRequest,
    background_tasks: BackgroundTasks
):
    """Start file conversion process"""
    try:
        logger.info(f"Starting conversion: {request.file_id} -> {request.target_format}")
        
        # Create conversion job
        conversion_id = str(uuid.uuid4())
        conversion_jobs[conversion_id] = {
            "status": "processing",
            "progress": 0,
            "file_id": request.file_id,
            "original_filename": request.original_filename,
            "target_format": request.target_format,
            "file_type": request.file_type,
            "started_at": datetime.now(timezone.utc),
            "message": "Starting conversion..."
        }
        
        # Add background task for actual conversion
        background_tasks.add_task(
            perform_conversion,
            conversion_id,
            request,
            file_handler,
            conversion_service
        )
        
        return {
            "conversion_id": conversion_id,
            "status": "processing",
            "message": "Conversion started"
        }
    
    except Exception as e:
        logger.error(f"Conversion error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

@api_router.get("/convert/status/{conversion_id}")
async def get_conversion_status(conversion_id: str):
    """Get conversion job status"""
    if conversion_id not in conversion_jobs:
        raise HTTPException(status_code=404, detail="Conversion job not found")
    
    job = conversion_jobs[conversion_id]
    
    return {
        "conversion_id": conversion_id,
        "status": job["status"],
        "progress": job["progress"],
        "message": job.get("message", ""),
        "output_file_id": job.get("output_file_id"),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

async def perform_conversion(
    conversion_id: str,
    request: ConversionRequest,
    file_handler: FileHandler,
    conversion_service: ConversionService
):
    """Background task to perform actual file conversion"""
    try:
        start_time = time.time()
        job = conversion_jobs[conversion_id]
        
        # Get uploaded file
        file_path = file_handler.get_file_path(request.file_id, request.file_type)
        if not file_path:
            job["status"] = "failed"
            job["message"] = "Source file not found"
            logger.error(f"Source file not found: {request.file_id}")
            return
        
        # Update job status
        job["progress"] = 25
        job["message"] = "Processing file..."
        
        # Perform conversion based on file type
        if request.file_type == 'image':
            success, message, output_path = await conversion_service.convert_image(
                file_path,
                request.target_format,
                quality=request.options.get('quality', 90),
                resize=request.options.get('resize', False),
                width=request.options.get('width'),
                height=request.options.get('height')
            )
        elif request.file_type == 'document':
            success, message, output_path = await conversion_service.convert_document(
                file_path,
                request.target_format
            )
        else:
            success = False
            message = "Unsupported file type"
            output_path = None
        
        # Update job with results
        if success:
            job["progress"] = 100
            job["status"] = "completed"
            job["message"] = message
            job["output_file_id"] = output_path.name.split('.')[0] if output_path else None
            job["output_file"] = output_path
            
            # Save to database
            conversion_time_ms = int((time.time() - start_time) * 1000)
            await save_conversion_history(
                db, request, job["output_file_id"],
                output_path.stat().st_size if output_path else 0,
                conversion_time_ms
            )
            
            logger.info(f"Conversion completed: {conversion_id} in {conversion_time_ms}ms")
        else:
            job["progress"] = 100
            job["status"] = "failed"
            job["message"] = message
            
            # Save failed conversion to database
            await save_conversion_history(
                db, request, None, 0, int((time.time() - start_time) * 1000),
                error=message
            )
            
            logger.error(f"Conversion failed: {conversion_id} - {message}")
    
    except Exception as e:
        job = conversion_jobs.get(conversion_id)
        if job:
            job["status"] = "failed"
            job["message"] = f"Error: {str(e)}"
        logger.error(f"Conversion exception: {str(e)}")

# ============ DOWNLOAD ENDPOINTS ============
@api_router.get("/download/{output_file_id}")
async def download_file(output_file_id: str, background_tasks: BackgroundTasks):
    """Download converted file"""
    try:
        logger.info(f"Download request: {output_file_id}")
        
        # Find the output file
        output_path = None
        for file in Path(CONVERTED_DIR).glob(f"{output_file_id}*"):
            if file.is_file():
                output_path = file
                break
        
        if not output_path or not output_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Get MIME type
        mime_type, _ = mimetypes.guess_type(str(output_path))
        if not mime_type:
            mime_type = "application/octet-stream"
        
        # Schedule file cleanup after download
        background_tasks.add_task(cleanup_old_files, days=1)
        
        return FileResponse(
            path=output_path,
            media_type=mime_type,
            filename=output_path.name
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

# ============ UTILITY FUNCTIONS ============
async def save_conversion_history(
    db,
    request: ConversionRequest,
    output_file_id: Optional[str],
    output_size: int,
    conversion_time_ms: int,
    error: Optional[str] = None
):
    """Save conversion history to database"""
    try:
        history = {
            "id": str(uuid.uuid4()),
            "original_filename": request.original_filename,
            "file_type": request.file_type,
            "input_format": request.original_filename.split('.')[-1],
            "output_format": request.target_format,
            "output_filename": output_file_id,
            "output_size": output_size,
            "status": "failed" if error else "completed",
            "error_message": error,
            "conversion_time_ms": conversion_time_ms,
            "options": request.options,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.conversion_history.insert_one(history)
        logger.info(f"Conversion history saved: {history['id']}")
    except Exception as e:
        logger.error(f"Failed to save conversion history: {str(e)}")

def cleanup_old_files(days: int = 7):
    """Clean up old files (synchronous function for background task)"""
    try:
        import time
        cutoff_time = time.time() - (days * 24 * 60 * 60)
        
        for root, dirs, files in os.walk(CONVERTED_DIR):
            for file in files:
                file_path = Path(root) / file
                if os.path.getmtime(str(file_path)) < cutoff_time:
                    os.remove(str(file_path))
                    logger.info(f"Deleted old file: {file}")
    except Exception as e:
        logger.error(f"Cleanup error: {str(e)}")

# ============ ROUTER INCLUSION ============
app.include_router(api_router)

# ============ SHUTDOWN EVENTS ============
@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown"""
    logger.info("Shutting down database connection")
    client.close()

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info("Starting up Ryloze Converter API")
    # Create necessary directories
    Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    Path(CONVERTED_DIR).mkdir(parents=True, exist_ok=True)
    logger.info(f"Upload dir: {UPLOAD_DIR}")
    logger.info(f"Converted dir: {CONVERTED_DIR}")
