from pymongo import MongoClient

print("Testing MongoDB connection...")
try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client.pitchdb
    print("Connected to MongoDB successfully!")
    print("Databases:", client.list_database_names())
    
    # Test insert and find
    test_doc = {"test": "hello"}
    result = db.test.insert_one(test_doc)
    print("Inserted test document")
    
    found = db.test.find_one({"test": "hello"})
    print("Found document:", found)
    
    # Clean up
    db.test.delete_one({"test": "hello"})
except Exception as e:
    print("MongoDB Error:", str(e))