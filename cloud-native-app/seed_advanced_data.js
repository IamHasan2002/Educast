const { initDB, createUser, createPost, getAllUsers } = require('./utils/db');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

async function seed() {
    await initDB();

    console.log('Seeding Advanced Data...');

    // 1. Create Users
    const users = [
        {
            id: uuidv4(),
            username: 'Mr. Smith',
            email: 'smith@uni.ac.uk',
            password: 'pass',
            role: 'teacher',
            country: 'United Kingdom',
            university: 'Ulster University',
            subject: 'CSE',
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            username: 'Dr. Jones',
            email: 'jones@usa.edu',
            password: 'pass',
            role: 'teacher',
            country: 'USA',
            university: 'Harvard',
            subject: 'Business',
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            username: 'Rahim',
            email: 'rahim@bd.edu',
            password: 'pass',
            role: 'student',
            country: 'Bangladesh',
            university: 'Dhaka University',
            subject: 'Art',
            createdAt: new Date().toISOString()
        }
    ];

    for (const u of users) {
        await createUser(u);
        console.log(`Created User: ${u.username} (${u.role}, ${u.country})`);
    }

    // 2. Create Posts
    const posts = [
        {
            id: uuidv4(),
            userId: users[0].id,
            username: users[0].username,
            content: 'Lecture Notes for CSE101. Please read.',
            mediaUrl: 'https://educaststorage001.blob.core.windows.net/uploads/lecture.pdf',
            mediaType: 'application/pdf',
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            userId: users[1].id,
            username: users[1].username,
            content: 'Business Strategy 101 Video.',
            mediaUrl: 'https://cdn.pixabay.com/vimeo/321159747/river-23961.mp4?width=640&hash=d855877f240a5015e76d05779075775', // Dummy Video
            mediaType: 'video/mp4',
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            userId: users[2].id,
            username: users[2].username,
            content: 'Beautiful sunset in Dhaka.',
            mediaUrl: 'https://via.placeholder.com/600x400',
            mediaType: 'image/jpeg',
            createdAt: new Date().toISOString()
        }
    ];

    for (const p of posts) {
        await createPost(p);
        console.log(`Created Post by ${p.username} (${p.mediaType})`);
    }

    console.log('Seeding Complete!');
}

seed();
