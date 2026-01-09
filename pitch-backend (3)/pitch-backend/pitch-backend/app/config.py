import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/pitchdb")
    JWT_SECRET = os.getenv("JWT_SECRET", "devsecret")
    JSON_SORT_KEYS = False
