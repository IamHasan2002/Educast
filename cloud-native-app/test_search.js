const http = require('http');

function testSearch(query) {
    return new Promise((resolve) => {
        http.get(`http://localhost:3000/api/content?search=${query}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Query: "${query}" -> Status: ${res.statusCode}, Results: ${JSON.parse(data).length}`);
                resolve();
            });
        }).on('error', (err) => {
            console.error(`Error: ${err.message}`);
            resolve();
        });
    });
}

async function run() {
    console.log('Testing Search API...');
    await testSearch('cvsc');  // Should match content
    await testSearch('Hasan'); // Should match username
    await testSearch('vscv');  // Should NOT match
    await testSearch('');      // Should return all (1)
}

run();
