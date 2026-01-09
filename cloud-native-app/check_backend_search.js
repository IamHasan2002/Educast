const http = require('http');

function search(term) {
    const url = `http://localhost:3001/api/content?search=${encodeURIComponent(term)}`;
    console.log(`Searching for: "${term}"...`);

    http.get(url, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            try {
                const posts = JSON.parse(data);
                console.log(`Found ${posts.length} results.`);
                if (posts.length > 0) {
                    console.log('Sample:', posts[0].content);
                }
            } catch (e) {
                console.error('Error parsing JSON:', e.message);
                console.log('Raw Response:', data);
            }
        });
    }).on('error', (e) => console.error('Request Error:', e.message));
}

// Test known existing content from seeds
search('Welcome');
search('CSE');
search('Bangladesh');
