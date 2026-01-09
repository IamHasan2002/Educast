import urllib.request
import json

# Test health endpoint
print("Testing /api/health...")
try:
    response = urllib.request.urlopen('http://127.0.0.1:5001/api/health')
    data = json.loads(response.read().decode())
    print("Success!")
    print("Response:", json.dumps(data, indent=2))
except Exception as e:
    print("Error:", str(e))

# Test registration
print("\nTesting /api/auth/register...")
try:
    data = json.dumps({
        "email": "test@example.com",
        "password": "testpass123"
    }).encode('utf-8')
    
    req = urllib.request.Request(
        'http://127.0.0.1:5001/api/auth/register',
        data=data,
        headers={'Content-Type': 'application/json'}
    )
    response = urllib.request.urlopen(req)
    result = json.loads(response.read().decode())
    print("Success!")
    print("Response:", json.dumps(result, indent=2))
except Exception as e:
    print("Error:", str(e))