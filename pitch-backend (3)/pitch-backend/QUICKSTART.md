# AngularJS Frontend for Pitch Booking Backend

## Quick Start

### 1. Run the setup script
```powershell
powershell -ExecutionPolicy Bypass -File setup_all_files.ps1
```

This will create all necessary files and directories for the frontend application.

### 2. Install a local web server

**Option A: Using Node.js (Recommended)**
```bash
npm install -g http-server
```

**Option B: Using Python**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

### 3. Start the web server

**If using http-server:**
```bash
http-server -p 8080 -c-1
```

**If using Python:**
Already started in step 2

### 4. Make sure backend is running

In the pitch-backend directory:
```bash
cd pitch-backend
flask --app app:create_app run --debug --port 5001
```

### 5. Open in browser

Navigate to: `http://localhost:8080`

## Features

✅ **User Authentication**
- Login and Registration
- JWT token-based authentication
- Protected routes for authenticated users

✅ **Pitch Management**
- Browse all available pitches
- Advanced filtering (by status, type, price, location, etc.)
- Search functionality
- View detailed pitch information
- Add new pitches (requires authentication)

✅ **Reviews System**
- View pitch reviews and ratings
- Add reviews (requires authentication)
- Star rating system

✅ **Analytics Dashboard**
- Average price by ground
- Top-rated pitches
- Visual statistics

## Application Structure

```
pitch-backend/
├── index.html              # Main entry point
├── css/
│   └── style.css          # Custom styles
├── app/
│   ├── app.js             # App configuration & routing
│   ├── controllers/       # Page controllers
│   │   ├── mainController.js
│   │   ├── homeController.js
│   │   ├── loginController.js
│   │   ├── registerController.js
│   │   ├── pitchListController.js
│   │   ├── pitchDetailController.js
│   │   ├── addPitchController.js
│   │   └── analyticsController.js
│   ├── services/          # API services
│   │   ├── authService.js
│   │   ├── pitchService.js
│   │   └── analyticsService.js
│   └── directives/        # Custom directives
│       └── pitchCard.js
└── views/                 # HTML templates
    ├── home.html
    ├── login.html
    ├── register.html
    ├── pitch-list.html
    ├── pitch-detail.html
    ├── add-pitch.html
    └── analytics.html
```

## Configuration

The API endpoint is configured in `app/app.js`:

```javascript
.constant('API_URL', 'http://localhost:5001/api')
```

Change this if your backend runs on a different port or URL.

## CORS Setup

Make sure your Flask backend has CORS enabled. Add to your Flask app:

```python
from flask_cors import CORS

app = create_app()
CORS(app)
```

Or install flask-cors:
```bash
pip install flask-cors
```

## Technologies Used

- **AngularJS 1.8.2** - Frontend framework
- **Angular Route** - Client-side routing
- **Bootstrap 5.1.3** - UI framework
- **Font Awesome 6.0** - Icons
- **HTML5/CSS3** - Markup and styling

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/home` | Landing page with featured pitches | No |
| `/login` | User login | No |
| `/register` | User registration | No |
| `/pitches` | Browse all pitches with filters | No |
| `/pitches/:id` | View pitch details and reviews | No |
| `/add-pitch` | Create a new pitch | Yes |
| `/analytics` | View analytics dashboard | No |

## Usage Guide

### Browsing Pitches

1. Click "Browse Pitches" in the navigation
2. Use filters to narrow down results:
   - Search by name
   - Filter by ground, status, type
   - Set price range
   - Filter by bowling machine availability
3. Click on any pitch card to view details

### Adding a Pitch

1. Login or register
2. Click "Add Pitch" in navigation
3. Fill in the form with pitch details
4. Submit to create

### Adding Reviews

1. Login or register
2. Navigate to a pitch detail page
3. Use the review form on the right side
4. Select rating (1-5 stars) and add comment
5. Submit review

### Viewing Analytics

1. Click "Analytics" in navigation
2. View average prices by ground
3. See top-rated pitches

## Troubleshooting

**Problem:** "Failed to load pitches" error
- **Solution:** Make sure backend is running on port 5001
- Check backend terminal for errors
- Verify CORS is enabled in backend

**Problem:** "Login failed" or "Registration failed"
- **Solution:** Check backend logs
- Verify MongoDB is running
- Check network tab in browser DevTools

**Problem:** Pages not loading
- **Solution:** Make sure you're using a web server (http-server or Python server)
- Don't open index.html directly in browser (file:// protocol won't work with AJAX)

**Problem:** Changes not reflecting
- **Solution:** Clear browser cache or use Ctrl+Shift+R to hard refresh
- Check browser console for errors

## Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Any modern browser with JavaScript enabled

## Development

To modify the application:

1. Edit files in respective directories
2. Refresh browser to see changes
3. Check browser console for JavaScript errors
4. Use browser DevTools Network tab to debug API calls

## Default Test Account

After importing backend data:
- Email: `test@example.com`
- Password: `password123`

Or create your own account via registration.

## Support

For backend API documentation, refer to `pitch-backend/README.md`

## License

© 2025 Pitch Booking System
