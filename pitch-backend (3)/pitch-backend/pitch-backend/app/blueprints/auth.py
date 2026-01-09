from flask import Blueprint, request, jsonify
from ..extensions import mongo
from ..utils import create_token
import bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "email and password required"}), 400
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "email already registered"}), 409
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    res = mongo.db.users.insert_one({"email": email, "password": hashed})
    token = create_token(res.inserted_id, email)
    return jsonify({"token": token}), 201

@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")
    user = mongo.db.users.find_one({"email": email})
    if not user or not bcrypt.checkpw((password or "").encode(), user["password"]):
        return jsonify({"error": "invalid credentials"}), 401
    token = create_token(user["_id"], email)
    return jsonify({"token": token}), 200
