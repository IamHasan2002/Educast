# Pitch Booking Frontend (AngularJS)

This is a complete AngularJS frontend application for the Pitch Booking backend API.

## Features

- User authentication (Login/Register)
- Browse and search pitches with filters
- View pitch details and reviews
- Add new pitches (authenticated users)
- Add/edit/delete reviews
- Analytics dashboard
- Responsive design with Bootstrap 5

## Quick Setup

### Option 1: Use a simple HTTP server

1. **Install Node.js** (if not already installed)

2. **Install http-server globally:**
```bash
npm install -g http-server
```

3. **Run the application:**
```bash
http-server -p 8080 -c-1
```

4. **Open browser:**
Navigate to `http://localhost:8080`

### Option 2: Use Python's built-in server

```bash
python -m http.server 8080
```

### Option 3: Use any other static file server

## Configuration

The API endpoint is configured in `app/app.js`:

```javascript
.constant('API_URL', 'http://localhost:5001/api')
```

Change this if your backend runs on a different port or domain.

## Project Structure

```
pitch-backend/
├── index.html                 # Main HTML file
├── css/
│   └── style.css             # Custom styles
├── app/
│   ├── app.js                # App configuration and routing
│   ├── controllers/          # Controllers for each view
│   │   ├── mainController.js
│   │   ├── homeController.js
│   │   ├── loginController.js
│   │   ├── registerController.js
│   │   ├── pitchListController.js
│   │   ├── pitchDetailController.js
│   │   ├── addPitchController.js
│   │   └── analyticsController.js
│   ├── services/             # Services for API calls
│   │   ├── authService.js
│   │   ├── pitchService.js
│   │   └── analyticsService.js
│   └── directives/           # Custom directives
│       └── pitchCard.js
└── views/                    # HTML templates
    ├── home.html
    ├── login.html
    ├── register.html
    ├── pitch-list.html
    ├── pitch-detail.html
    ├── add-pitch.html
    └── analytics.html
```

## Backend Requirements

Make sure the Flask backend is running on `http://localhost:5001`:

```bash
cd pitch-backend
flask --app app:create_app run --debug --port 5001
```

## CORS Configuration

The backend needs to allow CORS for the frontend to work. Add this to your Flask app if not already configured:

```python
from flask_cors import CORS
CORS(app)
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Pitches**: View all available pitches with filters
3. **Search**: Filter by ground, status, type, price range, etc.
4. **View Details**: Click on a pitch to see full details and reviews
5. **Add Reviews**: Leave reviews and ratings for pitches
6. **Add Pitches**: Create new pitch listings (requires login)
7. **Analytics**: View statistics and insights

## Default Test User

After running the backend data import script, you can login with:
- Username/Email: test@example.com
- Password: password123

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technologies Used

- AngularJS 1.8.2
- Bootstrap 5.1.3
- Font Awesome 6.0.0
- HTML5/CSS3
