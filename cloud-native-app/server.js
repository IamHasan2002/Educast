if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    const appInsights = require('applicationinsights');
    appInsights.setup().start();
    console.log('[Startup] Azure App Insights started');
}

console.log('[Startup] Importing modules...');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

console.log('[Startup] Importing DB utils...');
const { initDB } = require('./utils/db');
console.log('[Startup] Importing Blob utils...');
const { initStorage } = require('./utils/blobStorage');

console.log('[Startup] Initializing Express...');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
console.log('[Startup] Configuring middleware...');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure directories
console.log('[Startup] Checking directories...');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    console.log('[Startup] Creating data dir...');
    fs.mkdirSync(dataDir);
}

const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    console.log('[Startup] Creating uploads dir...');
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
console.log('[Startup] Importing Routes...');
try {
    const authRoutes = require('./routes/authRoutes');
    console.log('[Startup] Mounting Auth Routes...');
    app.use('/api/auth', authRoutes);

    const contentRoutes = require('./routes/contentRoutes');
    console.log('[Startup] Mounting Content Routes...');
    app.use('/api/content', contentRoutes);
} catch (error) {
    console.error('[Startup ERROR] Failed to load routes:', error);
    process.exit(1);
}

// Base route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
console.log('[Startup] Connecting to Cloud Services...');
Promise.all([initDB(), initStorage()]).then(() => {
    console.log('[Server] Database & Storage initialized.');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('[Server ERROR] Failed to start:', err);
    process.exit(1);
});
