from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    message: str

@router.post("/support")
def emotional_support_chat(request: ChatRequest):
    # Mocking AI integration.
    # In reality, this would call Gemini or OpenAI API
    user_msg_lower = request.message.lower()
    if "exhausted" in user_msg_lower or "overwhelmed" in user_msg_lower:
        return {
            "reply": "That sounds overwhelming. You’re handling a lot right now. Would you like to schedule some personal time or join a nearby support circle meetup?"
        }
    return {
        "reply": "I'm here to listen. It's completely normal to feel this way. Remember to take a deep breath."
    }

@router.get("/recommendations/{user_id}")
def circle_recommendations(user_id: int):
    # Mock smart circle recommendations based on location/interests
    return [
        {
            "id": 1,
            "name": "Wellness Walkers",
            "members": 6,
            "distance": "1.2 km",
            "match_reason": "Based on your interest in Walking and Proximity"
        },
        {
            "id": 2,
            "name": "Mindful Mothers",
            "members": 8,
            "distance": "3.0 km",
            "match_reason": "Matches your availability on Weekends"
        }
    ]
