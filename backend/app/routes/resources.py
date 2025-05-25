from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from bson import ObjectId
from bson.errors import InvalidId
import os
import datetime
import uuid

resources_bp = Blueprint('resources', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'txt'}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def recursive_serialize(obj):
    """
    Recursively convert BSON document to JSON-serializable form:
    - ObjectId -> str
    - datetime -> ISO string
    - dict and list are recursively processed
    """
    if isinstance(obj, list):
        return [recursive_serialize(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: recursive_serialize(v) for k, v in obj.items()}
    elif isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime.datetime):
        return obj.isoformat()
    else:
        return obj

@resources_bp.route('/upload', methods=['POST'])
def upload_resource():
    if not request.content_type.startswith('multipart/form-data'):
        return jsonify({'error': 'Content-type must be multipart/form-data'}), 400

    file = request.files.get('file')
    data = request.form

    # Validate required fields (tags removed)
    for field in ['title', 'description', 'file_type', 'user_id', 'categories']:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Parse and validate categories
    categories = [c.strip() for c in data['categories'].split(',') if c.strip()]
    if not (1 <= len(categories) <= 3):
        return jsonify({'error': 'Provide between 1 and 3 categories'}), 400

    external_link = data.get('external_link')
    if not file and not external_link:
        return jsonify({'error': 'Either file or external_link is required'}), 400

    # Handle file upload if present
    filename = None
    if file:
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        raw = file.read()
        if len(raw) > MAX_FILE_SIZE_BYTES:
            return jsonify({'error': 'File exceeds max size of 5MB'}), 400
        file.seek(0)

        ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
        fname = f"{uuid.uuid4().hex}.{ext}"
        upload_folder = os.path.join(current_app.root_path, 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, fname))
        filename = fname

    # Construct resource document, with empty tags list
    resource = {
        'title': data['title'],
        'description': data['description'],
        'categories': categories,
        'tags': [],                       # tags are now optional/default empty
        'uploader_id': data['user_id'],
        'file_type': data['file_type'],
        'file_name': filename,
        'external_link': external_link,
        'rating': 0,
        'uploaded_at': datetime.datetime.utcnow()
    }

    result = current_app.mongo.resources.insert_one(resource)
    return jsonify({
        'message': 'Resource uploaded successfully',
        'resource_id': str(result.inserted_id)
    }), 201

@resources_bp.route('/list', methods=['GET'])
def list_resources():
    query = {}
    file_type = request.args.get('type')
    uploaded_by = request.args.get('uploaded_by')

    if file_type:
        query['file_type'] = file_type.lower()
    if uploaded_by:
        query['uploader_id'] = uploaded_by

    docs = list(current_app.mongo.resources.find(query))
    serialized_docs = [recursive_serialize(doc) for doc in docs]
    return jsonify(serialized_docs), 200

@resources_bp.route('/<resource_id>', methods=['GET'])
def get_resource(resource_id):
    try:
        doc = current_app.mongo.resources.find_one({'_id': ObjectId(resource_id)})
        if not doc:
            return jsonify({'error': 'Resource not found'}), 404
    except InvalidId:
        return jsonify({'error': 'Invalid resource ID'}), 400

    file_url = None
    if doc.get('file_name'):
        file_url = f"http://localhost:5000/uploads/{doc['file_name']}"

    resource = {
        '_id': str(doc['_id']),
        'title': doc['title'],
        'description': doc['description'],
        'categories': doc['categories'],
        'tags': doc.get('tags', []),
        'file_type': doc['file_type'],
        'external_link': doc.get('external_link'),
        'file_url': file_url,
        'uploaded_at': doc['uploaded_at'].isoformat()
    }
    return jsonify(resource), 200

@resources_bp.route('/download/<resource_id>', methods=['GET'])
def download_resource(resource_id):
    try:
        doc = current_app.mongo.resources.find_one({'_id': ObjectId(resource_id)})
        if not doc or not doc.get('file_name'):
            return jsonify({'error': 'File not found'}), 404
    except InvalidId:
        return jsonify({'error': 'Invalid resource ID'}), 400

    upload_folder = os.path.join(current_app.root_path, 'uploads')
    return send_file(os.path.join(upload_folder, doc['file_name']), as_attachment=True)

@resources_bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Resources route is working"}), 200
