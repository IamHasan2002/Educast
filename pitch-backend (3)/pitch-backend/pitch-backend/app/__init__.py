import os
from flask import Flask, jsonify
from flask_cors import CORS
from .extensions import mongo
from .config import Config
from .blueprints.auth import auth_bp
from .blueprints.pitches import pitches_bp
from .blueprints.users import users_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config())
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    mongo.init_app(app)

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(pitches_bp, url_prefix="/api/pitches")
    app.register_blueprint(users_bp, url_prefix="/api/users")

    @app.route("/")
    def root():
        return jsonify({
            "message": "Pitch Booking API",
            "version": "1.0",
            "docs": "See README.md or import postman/pitch-api-demo.postman_collection.json",
            "health": "/api/health",
            "endpoints": {
                "auth": {
                    "register": "POST /api/auth/register",
                    "login": "POST /api/auth/login"
                },
                "pitches": {
                    "list": "GET /api/pitches",
                    "create": "POST /api/pitches (auth)",
                    "get": "GET /api/pitches/{id}",
                    "update": "PATCH /api/pitches/{id} (auth)",
                    "delete": "DELETE /api/pitches/{id} (auth)",
                    "reviews": "POST /api/pitches/{id}/reviews"
                },
                "analytics": {
                    "avg_price_by_ground": "GET /api/pitches/analytics/avg-price-by-ground",
                    "top_rated": "GET /api/pitches/analytics/top-rated"
                }
            }
        }), 200

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"}), 200

    # Error handlers
    @app.errorhandler(400)
    def bad_request(e): return jsonify(error="Bad Request", detail=str(e)), 400

    @app.errorhandler(401)
    def unauth(e): return jsonify(error="Unauthorized", detail=str(e)), 401

    @app.errorhandler(404)
    def not_found(e): return jsonify(error="Not Found", detail=str(e)), 404

    @app.errorhandler(422)
    def unprocessable(e): return jsonify(error="Unprocessable Entity", detail=str(e)), 422

    @app.errorhandler(500)
    def server_error(e): return jsonify(error="Server Error", detail=str(e)), 500

    return app
