# Pitch Forecast Frontend

A responsive AngularJS web application for pitch insights, forecasting, and management with a modern red and black theme.

## Features

- 🎯 **Browse Pitches**: View all pitch data with filters
- ⭐ **Reviews & Ratings**: Read and write reviews for pitches
- 🔮 **Forecasting**: Explore analytics focused on pitch trends
- 📅 **Management**: Simple pitch creation and updates
- 👤 **User Authentication**: Register and login functionality
- 📊 **Analytics**: View pitch statistics and top-rated grounds
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- 🎨 **Red & Black Theme**: Modern and professional color scheme

## Pages

1. **Home** (`/`) - Landing page with overview
2. **Browse Pitches** (`/pitches`) - List all pitches with filtering and search
3. **Pitch Details** (`/pitches/:id`) - View single pitch with reviews
4. **Create Pitch** (`/create-pitch`) - Add a new cricket pitch (auth required)
5. **Profile** (`/profile`) - User account management (auth required)
6. **Analytics** (`/analytics`) - View pitch statistics and insights
7. **Login** (`/login`) - User authentication
8. **Register** (`/register`) - New user registration

## Project Structure

```
frontend/
├── index.html           # Main HTML file with routing
├── server.py           # Simple Python HTTP server
├── css/
│   └── style.css       # Responsive red & black theme
├── js/
│   └── app.js          # AngularJS controllers, services, routing
└── views/
    ├── home.html
    ├── auth.html
    ├── register.html
    ├── pitches-list.html
    ├── pitch-detail.html
    ├── create-pitch.html
    ├── profile.html
    └── analytics.html
```

## Installation & Running

### Prerequisites
- Python 3.6+ (for the development server)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running on `http://127.0.0.1:5001`

### Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
python server.py
```

3. Open your browser and go to:
```
http://localhost:8080
```

## Configuration

The API base URL is configured in `js/app.js`:
```javascript
const API_URL = 'http://127.0.0.1:5001/api';
```

Change this if your backend is running on a different URL.

## Features Details

### Responsive Design
- **Mobile (< 480px)**: Single column layout, optimized touch targets
- **Tablet (480px - 768px)**: Two-column grid, adjusted spacing
- **Desktop (> 768px)**: Full multi-column layout with maximum width container

### Color Scheme
- **Primary Red**: #c41e3a - Used for buttons, links, and accents
- **Dark Black**: #1a1a1a - Used for navbar, footer, and backgrounds
- **Light Gray**: #f5f5f5 - Used for content backgrounds

### Filtering Options
- Ground name
- Status (Open, Closed, Under Maintenance)
- Environment (Indoor, Outdoor)
- Ground Type (Grass, Artificial Turf, Clay)
- Price range (Min/Max)
- Bowling Machine availability

### Authentication
- JWT-based authentication
- Tokens stored in browser localStorage
- Automatic token inclusion in API requests
- Protected routes for authenticated users

## Technologies Used

- **AngularJS 1.8** - Frontend framework
- **Bootstrap-style CSS** - Responsive grid system
- **HTML5** - Semantic markup
- **JavaScript (ES6)** - Application logic
- **Python** - Development server

## API Integration

The frontend communicates with the backend API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/pitches` - List pitches with filters
- `GET /api/pitches/:id` - Get single pitch
- `POST /api/pitches` - Create pitch (auth required)
- `PATCH /api/pitches/:id` - Update pitch (auth required)
- `DELETE /api/pitches/:id` - Delete pitch (auth required)
- `POST /api/pitches/:id/reviews` - Add review
- `GET /api/pitches/analytics/avg-price-by-ground` - Price analytics
- `GET /api/pitches/analytics/top-rated` - Top rated pitches

## Troubleshooting

### CORS Errors
If you get CORS errors, ensure:
1. Backend API is running and accessible
2. API base URL in `js/app.js` matches your backend URL
3. Backend has CORS headers configured

### Login Issues
- Verify JWT token is being saved in localStorage
- Check browser console for error messages
- Ensure backend is running and accessible

### Page Not Loading
1. Check browser console for JavaScript errors
2. Verify all files are accessible (check Network tab)
3. Clear browser cache and reload
4. Ensure backend API is responding to `/api/health`

## Development Notes

- No build process required - AngularJS is served from CDN
- All code is vanilla JavaScript (no TypeScript compilation)
- CSS uses CSS custom properties for theming
- localStorage is used for client-side state management

## Future Enhancements

- User profile picture upload
- Booking calendar integration
- Payment processing
- Email notifications
- Advanced search with maps integration
- Real-time availability updates
- Social sharing features
- Pitch availability calendar
