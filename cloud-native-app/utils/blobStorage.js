const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require('@azure/storage-blob');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const CONTAINER_NAME = 'uploads';

let blobServiceClient = null;
let containerClient = null;

// Parse Connection String to get Account Name and Key for SAS
function getCredsFromConnectionString(connectionString) {
    if (!connectionString) return null;
    const matches = connectionString.match(/AccountName=(.*?);/);
    const matchesKey = connectionString.match(/AccountKey=(.*?);/);
    if (matches && matchesKey) {
        return {
            accountName: matches[1],
            accountKey: matchesKey[1]
        };
    }
    return null;
}

async function initStorage() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
        console.log('[Storage] No Connection String. Using local uploads.');
        return;
    }

    try {
        console.log('[Storage] Connecting to Azure Blob Storage...');
        blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

        // Create container if not exists
        const createContainerResponse = await containerClient.createIfNotExists();

        if (createContainerResponse.succeeded) {
            console.log(`[Storage] Container '${CONTAINER_NAME}' created.`);
        } else {
            console.log(`[Storage] Container '${CONTAINER_NAME}' ready.`);
        }
    } catch (err) {
        console.error('[Storage ERROR] Failed to connect:', err.message);
        try { fs.appendFileSync('debug_output.txt', `INIT ERROR: ${err.message}\nDETAIL: ${JSON.stringify(err)}\n`); } catch (e) { }
        blobServiceClient = null;
    }
}

async function uploadFileToBlob(file) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!blobServiceClient || !containerClient) {
        throw new Error('Azure Storage not configured');
    }

    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload data
    await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype }
    });

    // Generate SAS Token for Public Read Access (Valid for 100 years for simplicity in coursework)
    const creds = getCredsFromConnectionString(connectionString);
    if (creds) {
        const sharedKeyCredential = new StorageSharedKeyCredential(creds.accountName, creds.accountKey);
        const sasToken = generateBlobSASQueryParameters({
            containerName: CONTAINER_NAME,
            blobName: blobName,
            permissions: BlobSASPermissions.parse("r"), // Read only
            expiresOn: new Date(new Date().valueOf() + 3153600000000) // 100 years
        }, sharedKeyCredential).toString();

        return `${blockBlobClient.url}?${sasToken}`;
    }

    return blockBlobClient.url;
}

module.exports = { initStorage, uploadFileToBlob };
