import sys
import traceback
from app import create_app

try:
    app = create_app()
    print("Flask app created successfully!")
    print("Config:", {k: v for k, v in app.config.items() if k in ['MONGO_URI', 'JWT_SECRET']})
    
    @app.before_first_request
    def before_first_request():
        print("First request received!")
        
    @app.errorhandler(500)
    def handle_500(e):
        print("500 error:", str(e))
        traceback.print_exc()
        return {"error": str(e)}, 500
        
    print("\nStarting Flask server...")
    app.run(host='127.0.0.1', port=5001, debug=True)
except Exception as e:
    print("Error starting Flask:", str(e))
    traceback.print_exc()