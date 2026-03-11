from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import database, models
import os
from routers import auth, circles, meetups, posts, users, chat, ai

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SheCircle API")

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(circles.router, prefix="/api")
app.include_router(meetups.router, prefix="/api")
app.include_router(posts.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# Mount the static frontend directory.
# In a real deployed app, it's often better to serve this via Nginx,
# but for our full-stack lightweight deployment, FastAPI mounting works perfectly.
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
# Trigger reload
