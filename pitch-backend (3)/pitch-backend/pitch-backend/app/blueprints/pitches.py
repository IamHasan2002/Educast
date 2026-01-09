from flask import Blueprint, request, jsonify
from bson import ObjectId
from ..extensions import mongo
from ..utils import require_auth, oid, serialize_json
from ..schemas.pitch import PitchCreateSchema, ReviewSchema
from marshmallow import ValidationError

pitches_bp = Blueprint("pitches", __name__)
pitch_schema = PitchCreateSchema()
review_schema = ReviewSchema()

def serialize_pitch(doc):
    return serialize_json(doc)

@pitches_bp.get("")
def list_pitches():
    # Filters: ground, status, env, min_price, max_price, has_bowling_machine, q (comment contains), sort, page, limit
    q = {}
    ground = request.args.get("ground")
    status = request.args.get("status")
    env = request.args.get("env")
    gtype = request.args.get("type")
    min_price = request.args.get("min_price", type=int)
    max_price = request.args.get("max_price", type=int)
    has_bm = request.args.get("has_bowling_machine")
    text = request.args.get("q")

    if ground: q["Ground"] = ground
    if status: q["Status"] = status
    if env: q["Environment"] = env
    if gtype: q["GroundType"] = gtype
    if min_price is not None or max_price is not None:
        q["PitchPrice"] = {}
        if min_price is not None: q["PitchPrice"]["$gte"] = min_price
        if max_price is not None: q["PitchPrice"]["$lte"] = max_price
        if not q["PitchPrice"]: del q["PitchPrice"]
    if has_bm in ("true","false"):
        q["Bowling Machine"] = {"$in": ["available","chargable"]} if has_bm=="true" else "not available"
    if text:
        q["Reviews.comment"] = {"$regex": text, "$options": "i"}

    # Pagination & sorting
    page = max(request.args.get("page", default=1, type=int), 1)
    limit = min(max(request.args.get("limit", default=20, type=int), 1), 100)
    sort = request.args.get("sort", "PitchPrice")
    direction = 1 if request.args.get("dir", "asc") == "asc" else -1

    cur = mongo.db.pitches.find(q).sort(sort, direction).skip((page-1)*limit).limit(limit)
    items = [serialize_pitch(d) for d in cur]
    total = mongo.db.pitches.count_documents(q)
    return jsonify({"items": items, "page": page, "limit": limit, "total": total}), 200

@pitches_bp.post("")
@require_auth
def create_pitch():
    data = request.get_json() or {}
    try:
        loaded = pitch_schema.load(data)
    except ValidationError as ve:
        return jsonify({"errors": ve.messages}), 422
    res = mongo.db.pitches.insert_one(loaded)
    created = mongo.db.pitches.find_one({"_id": res.inserted_id})
    return jsonify(serialize_pitch(created)), 201

@pitches_bp.get("/<pitch_id>")
def get_pitch(pitch_id):
    _id = oid(pitch_id)
    if not _id: return jsonify({"error":"invalid id"}), 400
    doc = mongo.db.pitches.find_one({"_id": _id})
    if not doc: return jsonify({"error":"not found"}), 404
    return jsonify(serialize_pitch(doc)), 200

@pitches_bp.patch("/<pitch_id>")
@require_auth
def update_pitch(pitch_id):
    _id = oid(pitch_id)
    if not _id: return jsonify({"error":"invalid id"}), 400
    data = request.get_json() or {}
    # Partial update: trust fields but validate allowable keys
    allowed = {"Pitch","Ground","location","PitchPrice","Status","GroundType","Environment","Bowling Machine","Reviews"}
    update = {k:v for k,v in data.items() if k in allowed}
    if not update: return jsonify({"error":"no valid fields"}), 400
    mongo.db.pitches.update_one({"_id": _id}, {"$set": update})
    doc = mongo.db.pitches.find_one({"_id": _id})
    return jsonify(serialize_pitch(doc)), 200

@pitches_bp.delete("/<pitch_id>")
@require_auth
def delete_pitch(pitch_id):
    _id = oid(pitch_id)
    if not _id: return jsonify({"error":"invalid id"}), 400
    res = mongo.db.pitches.delete_one({"_id": _id})
    if res.deleted_count == 0:
        return jsonify({"error":"not found"}), 404
    return jsonify({"status":"deleted"}), 200

# Subdocument: Reviews
@pitches_bp.post("/<pitch_id>/reviews")
def add_review(pitch_id):
    _id = oid(pitch_id)
    if not _id: return jsonify({"error":"invalid id"}), 400
    data = request.get_json() or {}
    try:
        review = review_schema.load(data)
    except Exception as e:
        return jsonify({"error":"validation failed", "detail": str(e)}), 422
    review["_id"] = ObjectId()
    mongo.db.pitches.update_one({"_id": _id}, {"$push": {"Reviews": review}})
    doc = mongo.db.pitches.find_one({"_id": _id})
    return jsonify(serialize_pitch(doc)), 201

@pitches_bp.patch("/<pitch_id>/reviews/<review_id>")
def edit_review(pitch_id, review_id):
    _id = oid(pitch_id)
    rid = oid(review_id)
    if not _id or not rid: return jsonify({"error":"invalid id"}), 400
    updates = request.get_json() or {}
    # Build update for array filter
    set_ops = {f"Reviews.$[rev].{k}": v for k,v in updates.items() if k in ("reviewer","rating","comment")}
    if not set_ops: return jsonify({"error":"no valid fields"}), 400
    res = mongo.db.pitches.update_one(
        {"_id": _id},
        {"$set": set_ops},
        array_filters=[{"rev._id": rid}]
    )
    if res.matched_count == 0:
        return jsonify({"error":"pitch or review not found"}), 404
    doc = mongo.db.pitches.find_one({"_id": _id})
    return jsonify(serialize_pitch(doc)), 200

@pitches_bp.delete("/<pitch_id>/reviews/<review_id>")
def delete_review(pitch_id, review_id):
    _id = oid(pitch_id)
    rid = oid(review_id)
    if not _id or not rid: return jsonify({"error":"invalid id"}), 400
    res = mongo.db.pitches.update_one({"_id": _id}, {"$pull": {"Reviews": {"_id": rid}}})
    if res.modified_count == 0:
        return jsonify({"error":"pitch or review not found"}), 404
    return jsonify({"status":"deleted"}), 200

# Aggregations / advanced queries
@pitches_bp.get("/analytics/avg-price-by-ground")
def avg_price_by_ground():
    pipeline = [
        {"$group": {"_id": "$Ground", "avgPrice": {"$avg": "$PitchPrice"}, "count": {"$sum": 1}}},
        {"$sort": {"avgPrice": 1}}
    ]
    data = list(mongo.db.pitches.aggregate(pipeline))
    for d in data:
        d["ground"] = d.pop("_id")
    return jsonify({"items": data}), 200

@pitches_bp.get("/analytics/top-rated")
def top_rated():
    pipeline = [
        {"$unwind": "$Reviews"},
        {"$group": {"_id": "$_id", "Pitch": {"$first":"$Pitch"}, "Ground": {"$first":"$Ground"},
                    "avgRating": {"$avg":"$Reviews.rating"}, "numReviews": {"$sum":1}}},
        {"$sort": {"avgRating": -1, "numReviews": -1}},
        {"$limit": 10}
    ]
    data = list(mongo.db.pitches.aggregate(pipeline))
    for d in data:
        d["_id"] = str(d["_id"])
    return jsonify({"items": data}), 200
