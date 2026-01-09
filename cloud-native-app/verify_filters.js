const http = require('http');

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function verify() {
    try {
        console.log('--- Verifying Advanced Filters ---');

        // 1. Test Role: Teacher (Expect 2)
        const teachers = await get('http://localhost:3001/api/content?role=teacher');
        console.log(`Role=Teacher: Found ${teachers.length} (Expected >= 2) -> ${teachers.length >= 2 ? 'PASS' : 'FAIL'}`);

        // 2. Test Country: Bangladesh (Expect 1)
        const bd = await get('http://localhost:3001/api/content?country=Bangladesh');
        console.log(`Country=Bangladesh: Found ${bd.length} (Expected >= 1) -> ${bd.length >= 1 ? 'PASS' : 'FAIL'}`);

        // 3. Test Media: PDF (Expect 1)
        const pdfs = await get('http://localhost:3001/api/content?mediaType=pdf');
        console.log(`Media=PDF: Found ${pdfs.length} (Expected >= 1) -> ${pdfs.length >= 1 ? 'PASS' : 'FAIL'}`);

        // 4. Test Media: Video (Expect 1)
        const videos = await get('http://localhost:3001/api/content?mediaType=video');
        console.log(`Media=Video: Found ${videos.length} (Expected >= 1) -> ${videos.length >= 1 ? 'PASS' : 'FAIL'}`);

    } catch (e) {
        console.error('Test Failed:', e);
    }
}

verify();
