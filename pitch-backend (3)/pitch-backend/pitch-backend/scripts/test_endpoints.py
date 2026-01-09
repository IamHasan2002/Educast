import requests
import json

BASE_URL = 'http://127.0.0.1:5001'

def test_endpoints():
    # 1. Test health endpoint
    print("\nTesting /api/health...")
    resp = requests.get(f'{BASE_URL}/api/health')
    print(f"Status: {resp.status_code}")
    print("Response:", json.dumps(resp.json(), indent=2))

    # 2. Register a user
    print("\nTesting /api/auth/register...")
    user_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    resp = requests.post(
        f'{BASE_URL}/api/auth/register',
        json=user_data  # requests handles JSON encoding correctly
    )
    print(f"Status: {resp.status_code}")
    print("Response:", json.dumps(resp.json(), indent=2))

    if resp.status_code == 400:  # If registration fails, try login
        print("\nTrying /api/auth/login instead...")
        resp = requests.post(
            f'{BASE_URL}/api/auth/login',
            json=user_data
        )
        print(f"Status: {resp.status_code}")
        print("Response:", json.dumps(resp.json(), indent=2))

    # 3. List pitches
    print("\nTesting /api/pitches...")
    resp = requests.get(f'{BASE_URL}/api/pitches')
    print(f"Status: {resp.status_code}")
    if resp.ok:
        pitches = resp.json()
        print(f"Found {len(pitches)} pitches:")
        for p in pitches:
            print(f"- {p.get('Ground')}: {p.get('Pitch')} ({p.get('Environment')})")

if __name__ == '__main__':
    test_endpoints()