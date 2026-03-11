from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    message: str


@router.post("/support")
def emotional_support_chat(request: ChatRequest):

    msg = request.message.lower()

    # Greeting responses
    if any(word in msg for word in ["hello", "hi", "hey"]):
        responses = [
            "Hello there! 😊 I'm your SheCircle support companion. How are you feeling today?",
            "Hi! I'm here to listen. Tell me what's on your mind today 💬",
            "Hey! I'm glad you reached out. How are you feeling right now? 🌸"
        ]
        return {"reply": random.choice(responses)}

    # Asking about the bot
    if "how are you" in msg:
        return {
            "reply": "I'm doing well, thank you for asking! 😊 I'm here to support you. How has your day been?"
        }

    # Positive feelings
    if any(word in msg for word in ["good", "great", "fine", "happy", "better"]):
        responses = [
            "That's wonderful to hear! 😊 It's always nice when things feel a bit lighter.",
            "I'm really glad you're feeling good today! 🌸 Would you like to explore some circles or activities?",
            "That makes me happy to hear! Keep taking care of yourself 💛"
        ]
        return {"reply": random.choice(responses)}

    # Exhaustion / burnout
    if any(word in msg for word in ["exhausted", "overwhelmed", "tired", "burnt out"]):
        responses = [
            "That sounds really exhausting. You're carrying a lot right now. 💛 Maybe a small break or connecting with others could help.",
            "I'm sorry you're feeling overwhelmed. Sometimes even a short pause or a supportive conversation can help. 🌿",
            "It sounds like you've been doing a lot lately. Remember it's okay to take time for yourself too. 🤍"
        ]
        return {"reply": random.choice(responses)}

    # Loneliness
    if any(word in msg for word in ["lonely", "alone"]):
        responses = [
            "I'm really glad you shared that with me. Feeling lonely can be tough, but you're not alone here. 🤍",
            "You're not alone in feeling this way. Many people experience this sometimes. Connecting with a circle could help. 🌸",
            "Thank you for opening up. Sometimes talking or meeting others who understand can make a big difference. 💬"
        ]
        return {"reply": random.choice(responses)}

    # Stress
    if any(word in msg for word in ["stress", "stressed", "pressure", "anxious"]):
        responses = [
            "That sounds stressful. Try taking a few slow breaths. You're doing the best you can. 🌿",
            "Stress can build up quietly. Even a short break or a walk can help reset your mind. 💛",
            "I hear you. Stress can feel heavy, but sharing it is already a step forward. 🤍"
        ]
        return {"reply": random.choice(responses)}

    # Help requests
    if "help" in msg:
        return {
            "reply": "I'm here to help 😊 You can talk about how you're feeling, or I can suggest support circles and meetups nearby."
        }

    # Default fallback
    responses = [
        "Thank you for sharing that with me. Tell me a little more about how you're feeling. 💬",
        "I'm here to listen. Would you like to talk more about what's been on your mind? 🌸",
        "I appreciate you opening up. Sometimes sharing even a little can help. 🤍"
    ]

    return {"reply": random.choice(responses)}


@router.get("/recommendations/{user_id}")
def circle_recommendations(user_id: int):

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