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
            } catch (e) { console.error(e.message); }
        });
    });
}

// "Lecture" was added by seed_advanced_data.js to Cosmos
search('Lecture');
search('Notes');
