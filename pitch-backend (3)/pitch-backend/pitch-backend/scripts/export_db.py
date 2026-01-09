import os
import json
from pymongo import MongoClient
from bson import json_util
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/pitchdb")

client = MongoClient(MONGO_URI)

# get_default_database() reads DB from URI (works for mongodb://.../dbname)
# use safe handling because Database objects don't implement boolean testing
try:
    db = client.get_default_database()
    if db is None:
        db = client["pitchdb"]
except Exception:
    db = client["pitchdb"]

os.makedirs("export", exist_ok=True)

def export_collection(name):
    docs = list(db[name].find())
    out_path = os.path.join("export", f"{name}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(docs, f, default=json_util.default, indent=2)
    print(f"Exported {name} -> {out_path}")

if __name__ == "__main__":
    for coll in ("pitches", "users"):
        export_collection(coll)
