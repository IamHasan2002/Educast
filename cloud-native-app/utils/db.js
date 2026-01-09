require('dotenv').config();
const { CosmosClient } = require('@azure/cosmos');
const fs = require('fs');
const path = require('path');

// Configuration
const connectionString = process.env.COSMOS_CONNECTION_STRING;
const DATABASE_ID = 'EduCastDB';
const CONTAINER_USERS = 'Users';
const CONTAINER_POSTS = 'Posts';

// Local Fallback Paths
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

let client = null;
let db = null;
let usersContainer = null;
let postsContainer = null;

// Initialize Database (Async)
async function initDB() {
    if (connectionString) {
        try {
            console.log('[DB] Connecting to Azure Cosmos DB...');
            client = new CosmosClient(connectionString);
            const { database } = await client.databases.createIfNotExists({ id: DATABASE_ID });
            db = database;

            const { container: uCont } = await db.containers.createIfNotExists({ id: CONTAINER_USERS, partitionKey: '/id' });
            usersContainer = uCont;

            const { container: pCont } = await db.containers.createIfNotExists({ id: CONTAINER_POSTS, partitionKey: '/userId' });
            postsContainer = pCont;
            console.log('[DB] Connected to Azure Cosmos DB successfully.');
        } catch (err) {
            console.error('[DB ERROR] Azure connection failed. Falling back to local files.', err.message);
            client = null;
        }
    } else {
        console.log('[DB] No Connection String found. Using local JSON files.');
    }

    // Ensure local files exist as backup/dev mode
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
    if (!fs.existsSync(POSTS_FILE)) fs.writeFileSync(POSTS_FILE, '[]');

    // Seed Admin (Local only usually, but good for check)
    await seedAdmin();
}

// Helper: Seed Admin
async function seedAdmin() {
    const adminUser = {
        id: 'admin-id',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'admin@edushare.com',
        university: 'Admin Uni',
        bio: 'System Administrator',
        createdAt: new Date().toISOString()
    };

    const users = await getAllUsers();
    if (!users.find(u => u.username === 'admin')) {
        await createUser(adminUser);
        console.log('[DB] Admin seeded.');
    }
}

// --- CRUD OPERATIONS (Hybrid) ---

// USERS
async function getAllUsers() {
    if (client) {
        const { resources } = await usersContainer.items.query("SELECT * from c").fetchAll();
        return resources;
    } else {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
}

async function createUser(user) {
    if (client) {
        await usersContainer.items.create(user);
    } else {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        users.push(user);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }
    return user;
}

async function updateUser(user) {
    if (client) {
        await usersContainer.item(user.id, user.id).replace(user);
    } else {
        let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx] = user;
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        }
    }
    return user;
}

// POSTS
async function getAllPosts() {
    if (client) {
        // Order by date descending
        const { resources } = await postsContainer.items.query("SELECT * from c ORDER BY c.createdAt DESC").fetchAll();
        return resources;
    } else {
        return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
    }
}

async function createPost(post) {
    if (client) {
        await postsContainer.items.create(post);
    } else {
        const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
        posts.unshift(post);
        fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    }
    return post;
}

async function deletePost(id, userId) { // UserId needed for partition key in Cosmos
    if (client) {
        // Cosmos requires partition key (userId) to delete efficiently, or we look it up first
        await postsContainer.item(id, userId).delete();
    } else {
        let posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
        posts = posts.filter(p => p.id !== id);
        fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    }
}

async function updatePost(id, userId, newContent) {
    if (client) {
        const { resource: post } = await postsContainer.item(id, userId).read();
        if (post) {
            post.content = newContent;
            await postsContainer.item(id, userId).replace(post);
            return post;
        }
    } else {
        let posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
        const idx = posts.findIndex(p => p.id === id);
        if (idx !== -1 && posts[idx].userId === userId) {
            posts[idx].content = newContent;
            fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
            return posts[idx];
        }
    }
    return null;
}

module.exports = {
    initDB,
    getAllUsers,
    createUser,
    updateUser,
    getAllPosts,
    createPost,
    updatePost,
    initDB,
    getAllUsers,
    createUser,
    updateUser,
    getAllPosts,
    createPost,
    deletePost
};
