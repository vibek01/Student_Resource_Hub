from flask import Flask, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient, errors
import os
from dotenv import load_dotenv
load_dotenv()  # reads .env in the same folder as run.py

def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_pyfile('config.py')

    # Enable CORS (frontend)
    CORS(app, origins="https://student-resource-hub-two.vercel.app", supports_credentials=True)

    # Connect to MongoDB Atlas
    try:
        mongo_client = MongoClient(app.config['MONGO_URI'])
        # student_resource_hub will be created if it doesn’t exist yet
        app.mongo = mongo_client.get_database()  # Uses db from URI
        print("✅ Connected to MongoDB Atlas")
    except errors.ConnectionFailure as e:
        print("❌ MongoDB Connection Failed:", e)

    # Serve uploaded files
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        upload_folder = os.path.join(app.root_path, 'uploads')
        return send_from_directory(upload_folder, filename)

    # Register routes
    try:
        from app.routes.auth import auth_bp
        from app.routes.resources import resources_bp
        from app.routes.user import user_bp

        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(resources_bp, url_prefix='/api/resources')
        app.register_blueprint(user_bp, url_prefix='/api/user')
        print("✅ Blueprints registered successfully")
    except Exception as e:
        print("❌ Error registering blueprints:", e)

    return app
