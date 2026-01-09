const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const POSTS_FILE = path.join(__dirname, 'data/posts.json');

const posts = [
    {
        id: uuidv4(),
        userId: uuidv4(),
        username: 'Admin',
        content: 'Welcome to EduShare Hub! Search for this post.',
        mediaUrl: null,
        mediaType: null,
        createdAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        userId: uuidv4(),
        username: 'Student1',
        content: 'I have uploaded a new PDF document about Cloud Computing.',
        mediaUrl: null,
        mediaType: null,
        createdAt: new Date().toISOString()
    }
];

if (!fs.existsSync(path.dirname(POSTS_FILE))) {
    fs.mkdirSync(path.dirname(POSTS_FILE), { recursive: true });
}

fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
console.log('Database seeded with 2 posts.');
