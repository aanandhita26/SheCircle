from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
from sqlalchemy.orm import Session
import models
from database import get_db

router = APIRouter(prefix="/ws", tags=["websockets"])

class ConnectionManager:
    def __init__(self):
        # Maps circle_id -> list of active websockets
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, circle_id: int):
        await websocket.accept()
        if circle_id not in self.active_connections:
            self.active_connections[circle_id] = []
        self.active_connections[circle_id].append(websocket)

    def disconnect(self, websocket: WebSocket, circle_id: int):
        if circle_id in self.active_connections:
            self.active_connections[circle_id].remove(websocket)

    async def broadcast(self, message: str, circle_id: int):
        if circle_id in self.active_connections:
            for connection in self.active_connections[circle_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/circle/{circle_id}")
async def websocket_endpoint(websocket: WebSocket, circle_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket, circle_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Simplistic parsing: "userId:message"
            try:
                user_id_str, content = data.split(":", 1)
                user_id = int(user_id_str)
            except ValueError:
                user_id = 0 # unknown
                content = data

            # Save to DB
            if user_id > 0:
                msg = models.Message(circle_id=circle_id, sender_id=user_id, content=content)
                db.add(msg)
                db.commit()

            # Broadcast to all in circle
            user = db.query(models.User).filter_by(id=user_id).first()
            sender_name = user.name if user else "Anonymous"
            await manager.broadcast(f"{sender_name}: {content}", circle_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, circle_id)
        await manager.broadcast("A member left the chat", circle_id)
