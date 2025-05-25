from flask import Blueprint, jsonify, current_app, request
from app.utils.jwt import decode_token
from bson import ObjectId

user_bp = Blueprint('user', __name__)

@user_bp.route('/me', methods=['GET'])
def get_user():
    token = request.cookies.get('token')
    if not token:
        return jsonify({"error": "Missing token"}), 401

    payload = decode_token(token)
    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    user_id = payload.get('user_id')
    if not user_id:
        return jsonify({"error": "Invalid token payload"}), 401

    user = current_app.mongo.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "_id": str(user.get("_id")),
        "name": user.get("name"),
        "email": user.get("email"),
        "created_at": user.get("created_at").isoformat() if user.get("created_at") else None
    }

    return jsonify(user_data), 200


@user_bp.route('/bookmarks', methods=['GET'])
def get_user_bookmarks():
    token = request.cookies.get('token')
    if not token:
        return jsonify({"error": "Missing token"}), 401

    payload = decode_token(token)
    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    user_id = payload.get('user_id')
    if not user_id:
        return jsonify({"error": "Invalid token payload"}), 401

    user = current_app.mongo.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    bookmark_ids = user.get("bookmarks", [])
    bookmark_obj_ids = [ObjectId(bid) if not isinstance(bid, ObjectId) else bid for bid in bookmark_ids]

    resources_cursor = current_app.mongo.resources.find({"_id": {"$in": bookmark_obj_ids}})

    bookmarks = []
    for res in resources_cursor:
        bookmarks.append({
            "_id": str(res["_id"]),
            "title": res.get("title"),
            "description": res.get("description", ""),
            "categories": res.get("categories", []),
            "tags": res.get("tags", []),
            "file_type": res.get("file_type", "unknown"),
            "uploaded_at": res.get("uploaded_at").isoformat() if res.get("uploaded_at") else None,
            "external_link": res.get("external_link", "")
        })

    return jsonify(bookmarks), 200


@user_bp.route('/bookmark/<resource_id>', methods=['POST'])
def toggle_bookmark(resource_id):
    token = request.cookies.get('token')
    if not token:
        return jsonify({"error": "Missing token"}), 401

    payload = decode_token(token)
    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    user_id = payload.get('user_id')
    if not user_id:
        return jsonify({"error": "Invalid token payload"}), 401

    try:
        user_obj_id = ObjectId(user_id)
        res_obj_id = ObjectId(resource_id)
    except Exception:
        return jsonify({"error": "Invalid ID format"}), 400

    user_col = current_app.mongo.users
    res_col = current_app.mongo.resources

    user = user_col.find_one({"_id": user_obj_id})
    resource = res_col.find_one({"_id": res_obj_id})

    if not user or not resource:
        return jsonify({"error": "User or Resource not found"}), 404

    # This is key: We ensure bookmarks are ObjectId type to avoid mismatches
    bookmarks = user.get("bookmarks", [])
    bookmarks_obj_ids = [bid if isinstance(bid, ObjectId) else ObjectId(bid) for bid in bookmarks]

    is_bookmarked = res_obj_id in bookmarks_obj_ids

    if is_bookmarked:
        user_col.update_one({"_id": user_obj_id}, {"$pull": {"bookmarks": res_obj_id}})
        res_col.update_one({"_id": res_obj_id}, {"$pull": {"bookmarked_by": user_obj_id}})
        return jsonify({"message": "Bookmark removed", "bookmarked": False}), 200
    else:
        user_col.update_one({"_id": user_obj_id}, {"$addToSet": {"bookmarks": res_obj_id}})
        res_col.update_one({"_id": res_obj_id}, {"$addToSet": {"bookmarked_by": user_obj_id}})
        return jsonify({"message": "Bookmark added", "bookmarked": True}), 200
    