const http = require('http');

function verify() {
    const url = 'http://localhost:3001/api/content?mediaType=audio';
    console.log(`Checking Filter: ${url}`);

    http.get(url, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            try {
                const posts = JSON.parse(data);
                if (posts.length > 0 && posts[0].mediaType.startsWith('audio/')) {
                    console.log(`PASS: Found ${posts.length} audio posts.`);
                } else {
                    console.error('FAIL: No audio posts found.');
                }
            } catch (e) { console.error('Error:', e.message); }
        });
    });
}

verify();
