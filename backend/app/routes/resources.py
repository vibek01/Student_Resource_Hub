from flask import Blueprint, request, jsonify

res_bp = Blueprint('resources', __name__)

@res_bp.route('/', methods=['GET'])
def get_resources():
    db = request.app.mongo
    resources = list(db.resources.find({}, {'_id': 0}))
    return jsonify(resources)
