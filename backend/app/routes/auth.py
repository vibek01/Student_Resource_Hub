from flask import Blueprint, request, jsonify, current_app, make_response
from werkzeug.security import check_password_hash
from app.utils.jwt import create_token
from app.models.user_model import create_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"error": "Name, email, and password are required"}), 400

    if current_app.mongo.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    user_doc = create_user(name, email, password)
    current_app.mongo.users.insert_one(user_doc)

    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    user = current_app.mongo.users.find_one({"email": email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_token(str(user['_id']), user['email'])

    response = make_response(jsonify({
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    }))

    response.set_cookie(
        'token',
        token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite='Lax',
        max_age=7 * 24 * 3600  # 7 days
    )

    return response

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie('token', '', expires=0)
    return response
