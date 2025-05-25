from werkzeug.security import generate_password_hash
from datetime import datetime

def create_user(name, email, password):
    hashed_password = generate_password_hash(password)
    return {
        "name": name,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "bookmarks": []  # list of ObjectId(resource_id)
    }
