import jwt
from datetime import datetime, timedelta
from app.config import SECRET_KEY

def create_token(user_id):
    return jwt.encode(
        {"user_id": str(user_id), "exp": datetime.utcnow() + timedelta(days=1)},
        SECRET_KEY,
        algorithm="HS256"
    )
