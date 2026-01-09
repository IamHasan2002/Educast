import os, json
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/pitchdb")
client = MongoClient(MONGO_URI)
# client.get_default_database() can return None; avoid using boolean checks on Database
# objects because pymongo Database doesn't implement __bool__.
db = client.get_default_database()
if db is None:
    db = client["pitchdb"]

# Load the provided dataset file path. Adjust if needed.
# Look for DATA_FILE env var first; then try a few repo-relative locations that
# are common when the data is included with the project.
default_candidates = [
    os.getenv("DATA_FILE"),
    os.path.join(os.path.dirname(__file__), "..", "data", "pitchForecastData.json"),
    os.path.join(os.path.dirname(__file__), "pitchForecastData.json"),
    os.path.join(os.path.dirname(__file__), "..", "pitchForecastData.json"),
    "/mnt/data/pitchForecastData.json",
]

DATA_FILE = None
for p in default_candidates:
    if not p:
        continue
    p = os.path.abspath(p)
    if os.path.exists(p):
        DATA_FILE = p
        break

if DATA_FILE is None:
    raise FileNotFoundError(
        "Could not find dataset file. Set DATA_FILE env var or place 'pitchForecastData.json' in one of:\n"
        f"  - {os.path.join(os.path.dirname(__file__), '..', 'data', 'pitchForecastData.json')}\n"
        f"  - {os.path.join(os.path.dirname(__file__), 'pitchForecastData.json')}\n"
        "Or update the script to point to your dataset.\n"
        "Example (PowerShell): $env:DATA_FILE='C:\\\\path\\to\\pitchForecastData.json'; python .\\scripts\\import_data.py"
    )

with open(DATA_FILE, "r") as f:
    data = json.load(f)

# Ensure review subdocuments have stable ObjectIds
for doc in data:
    for r in doc.get("Reviews", []):
        r["_id"] = ObjectId()

db.pitches.drop()
db.pitches.insert_many(data)
print(f"Imported {len(data)} documents into 'pitches' collection.")
