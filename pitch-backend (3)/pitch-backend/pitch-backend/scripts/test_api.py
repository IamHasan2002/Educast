import requests
import json
from pprint import pprint

def test_api():
    base_url = 'http://127.0.0.1:5001'
    
    print("\n1. Testing /api/health...")
    resp = requests.get(f'{base_url}/api/health')
    print(f'Status: {resp.status_code}')
    pprint(resp.json())
    
    print("\n2. Registering test user...")
    user_data = {
        'email': 'test@example.com',
        'password': 'testpass123'
    }
    resp = requests.post(f'{base_url}/api/auth/register', json=user_data)
    print(f'Status: {resp.status_code}')
    if resp.ok:
        token = resp.json().get('token')
        print("✓ Registration successful, got JWT token")
    else:
        print("! Registration failed (might already exist)")
        # Try logging in instead
        resp = requests.post(f'{base_url}/api/auth/login', json=user_data)
        token = resp.json().get('token') if resp.ok else None
        if token:
            print("✓ Login successful")
    
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    
    print("\n3. Getting all pitches...")
    resp = requests.get(f'{base_url}/api/pitches')
    print(f'Status: {resp.status_code}')
    pitches = resp.json()
    print(f"Found {len(pitches)} pitches:")
    for p in pitches:
        print(f"- {p.get('Ground')}: {p.get('Pitch')} ({p.get('Environment')})")
    
    if token:
        print("\n4. Getting user profile...")
        resp = requests.get(f'{base_url}/api/users/me', headers=headers)
        print(f'Status: {resp.status_code}')
        if resp.ok:
            pprint(resp.json())

    print("\nTests completed!")

if __name__ == '__main__':
    test_api()