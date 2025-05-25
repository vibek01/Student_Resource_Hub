from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_pyfile('config.py')
    app.mongo = MongoClient(app.config['MONGO_URI'])['student_resource_hub']

    from app.routes.auth import auth_bp
    from app.routes.resources import res_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(res_bp, url_prefix='/api/resources')

    return app
