from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import models
from database import get_db

router = APIRouter(prefix="/posts", tags=["posts"])

class PostCreate(BaseModel):
    content: str
    is_anonymous: bool = False
    author_id: Optional[int] = None

@router.get("/")
def get_posts(db: Session = Depends(get_db)):
    # Get all posts, order by latest
    posts = db.query(models.Post).order_by(models.Post.created_at.desc()).all()
    result = []
    for p in posts:
        result.append({
            "id": p.id,
            "content": p.content,
            "created_at": p.created_at,
            "is_anonymous": p.is_anonymous,
            "author_name": p.author.name if not p.is_anonymous and p.author else "Anonymous"
        })
    return result

@router.post("/")
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    new_post = models.Post(
        content=post.content,
        is_anonymous=post.is_anonymous,
        author_id=post.author_id if not post.is_anonymous else None
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post
