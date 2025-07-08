from fastapi import APIRouter, Request, Depends, Path
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.config import TEMPLATES_DIR_PATH
from app.database import get_db

router = APIRouter()

# Initialize Jinja2Templates using the imported templates_dir_path
templates = Jinja2Templates(directory=str(TEMPLATES_DIR_PATH))


@router.get("/manage", response_class=HTMLResponse)
async def index(request: Request, db: Session = Depends(get_db)):
    return templates.TemplateResponse("manage.html", {"request": request})

@router.get("/skin", response_class=HTMLResponse)
async def index_horizontal(request: Request, db: Session = Depends(get_db)):
    return templates.TemplateResponse("index_beautiful.html", {"request": request})

@router.get("/clusters", response_class=HTMLResponse)
async def read_clusters_page(request: Request, db: Session = Depends(get_db)):
    return templates.TemplateResponse("clusters.html", {"request": request})


@router.get("/clusters/{cluster_id}", response_class=HTMLResponse)
async def read_cluster_detail(
    request: Request,
    cluster_id: int = Path(..., description="The ID of the cluster", ge=1),
    db: Session = Depends(get_db)
):
    return templates.TemplateResponse("cluster_detail.html", {"request": request, "cluster_id": cluster_id})

@router.get("/upload", response_class=HTMLResponse)
async def upload_page(request: Request):
    return templates.TemplateResponse("upload.html", {"request": request})
