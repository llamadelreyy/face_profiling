from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

from app.routers import views, api

app = FastAPI(title="Airport Security Command Center", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api.router)

# Include legacy view routes (for backward compatibility)
app.include_router(views.router)

# Serve static files from the React build
frontend_build_path = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_build_path.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_build_path / "assets")), name="assets")

# Serve legacy static files
static_path = Path(__file__).parent / "static"
if static_path.exists():
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# Serve uploads
uploads_path = Path(__file__).parent.parent / "uploads"
if uploads_path.exists():
    app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")

@app.get("/")
async def root():
    """Redirect to home page"""
    if frontend_build_path.exists():
        return FileResponse(str(frontend_build_path / "index.html"))
    else:
        return {"message": "Airport Security Command Center API", "status": "running", "frontend": "not built"}

# Serve React app for all security module routes
@app.get("/test")
@app.get("/recognition")
@app.get("/alarm-verification")
@app.get("/intrusion-monitoring")
@app.get("/arrival-departure")
@app.get("/status-processing")
@app.get("/vehicle-tracking")
@app.get("/body-scanner")
@app.get("/vehicle-scanner")
@app.get("/container-scanner")
@app.get("/identification-tracking")
@app.get("/gate-security")
@app.get("/terminal-security")
@app.get("/security-check")
async def serve_security_modules():
    """Serve the React frontend for security module routes"""
    if frontend_build_path.exists():
        return FileResponse(str(frontend_build_path / "index.html"))
    else:
        return {"message": "Frontend not built. Please run 'npm run build' in the frontend directory."}

@app.get("/{path:path}")
async def catch_all(path: str):
    """Catch all routes and serve React frontend (SPA routing)"""
    if frontend_build_path.exists():
        # Check if it's a file request
        file_path = frontend_build_path / path
        if file_path.is_file():
            return FileResponse(str(file_path))
        # Otherwise serve the main index.html for SPA routing
        return FileResponse(str(frontend_build_path / "index.html"))
    else:
        return {"message": f"Route /{path} not found. Frontend not built."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)