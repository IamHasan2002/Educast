from flask import Blueprint, jsonify, request
from ..extensions import mongo
from ..utils import require_auth
from bson import ObjectId

users_bp = Blueprint("users", __name__)

@users_bp.get("/me")
@require_auth
def me():
    user = mongo.db.users.find_one({"_id": ObjectId(request.user["_id"])}, {"password": 0})
    return jsonify({"user": {"_id": str(user["_id"]), "email": user["email"]}}), 200
