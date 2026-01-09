import datetime, jwt, os
from flask import request, jsonify
from functools import wraps
from bson.objectid import ObjectId
from .extensions import mongo
from .config import Config

def serialize_json(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: serialize_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_json(item) for item in obj]
    return obj

def oid(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return None

def create_token(user_id, email):
    payload = {"sub": str(user_id), "email": email, "iat": int(datetime.datetime.utcnow().timestamp())}
    token = jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")
    return token

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            request.user = {"_id": payload["sub"], "email": payload["email"]}
        except Exception as e:
            return jsonify({"error": "Invalid token", "detail": str(e)}), 401
        return f(*args, **kwargs)
    return wrapper
