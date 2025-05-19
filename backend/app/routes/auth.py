from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.utils.jwt import create_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = request.app.mongo.users.find_one({"email": data['email']})
    if user and check_password_hash(user['password'], data['password']):
        token = create_token(user['_id'])
        return jsonify({"token": token}), 200
    return jsonify({"error": "Invalid credentials"}), 401
