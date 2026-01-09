import http.client
import json

def test_endpoints():
    conn = http.client.HTTPConnection("127.0.0.1", 5001)
    
    # Test health endpoint
    print("Testing /api/health...")
    try:
        conn.request("GET", "/api/health")
        response = conn.getresponse()
        print(f"Status: {response.status}")
        print("Response:", response.read().decode())
    except Exception as e:
        print("Error:", str(e))
    
    # Test registration
    print("\nTesting /api/auth/register...")
    try:
        headers = {'Content-Type': 'application/json'}
        data = json.dumps({
            "email": "test@example.com",
            "password": "testpass123"
        })
        
        conn.request("POST", "/api/auth/register", body=data, headers=headers)
        response = conn.getresponse()
        print(f"Status: {response.status}")
        print("Response:", response.read().decode())
    except Exception as e:
        print("Error:", str(e))
    
    conn.close()

if __name__ == '__main__':
    test_endpoints()