from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/pitchdb"
mongo = PyMongo(app)

@app.route("/test")
def test():
    try:
        # Test MongoDB connection
        result = mongo.db.test.insert_one({"test": "flask"})
        return {"status": "ok", "mongo_id": str(result.inserted_id)}
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)