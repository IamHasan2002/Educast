const { initDB, createPost } = require('./utils/db');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

async function seed() {
    await initDB();

    console.log('Seeding Audio Data...');

    const post = {
        id: uuidv4(),
        userId: 'f6b997cb-ace3-4c47-bbf2-8a78f91cc9a8', // Student1 from previous data
        username: 'Student1',
        content: 'Listen to my podcast about Cloud Native!',
        mediaUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c6a71325.mp3?filename=relax-electronic-trap-beat-116776.mp3', // Royalty free
        mediaType: 'audio/mpeg',
        createdAt: new Date().toISOString()
    };

    await createPost(post);
    console.log(`Created Audio Post: ${post.id}`);
}

seed();
