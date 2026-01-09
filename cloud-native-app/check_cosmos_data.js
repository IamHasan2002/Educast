require('dotenv').config();
const { CosmosClient } = require('@azure/cosmos');

const connectionString = process.env.COSMOS_CONNECTION_STRING;
const DATABASE_ID = 'EduShareDB';
const CONTAINER_POSTS = 'Posts';

async function checkData() {
    if (!connectionString) {
        console.log('No connection string.');
        return;
    }
    const client = new CosmosClient(connectionString);
    const container = client.database(DATABASE_ID).container(CONTAINER_POSTS);

    console.log(`Checking Container: ${CONTAINER_POSTS}...`);

    try {
        const { resources } = await container.items.query("SELECT * from c").fetchAll();
        console.log(`Found ${resources.length} Posts in Cloud DB:`);
        resources.forEach(r => {
            console.log(` - Post by ${r.username}: ${r.content} (Media: ${r.mediaUrl})`);
        });
    } catch (err) {
        console.error('Error querying Cloud DB:', err.message);
    }
}

checkData();
