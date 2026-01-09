const http = require('http');

function request(path, method, body) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3001,
            path: '/api/auth' + path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function verify() {
    try {
        console.log('--- Verifying Secure Auth ---');
        const username = 'SecureUser_' + Date.now();
        const password = 'SecretPassword123';

        // 1. Register
        console.log('Registering user...');
        const regRes = await request('/register', 'POST', { username, password, email: 'secure@test.com' });

        if (regRes.user && regRes.user.password.startsWith('$2a$')) {
            console.log('PASS: Password is hashed (' + regRes.user.password.substring(0, 10) + '...)');
        } else {
            console.error('FAIL: Password is NOT hashed:', regRes.user ? regRes.user.password : regRes);
        }

        // 2. Login
        console.log('Logging in...');
        const loginRes = await request('/login', 'POST', { username, password });
        if (loginRes.message === 'Login successful') {
            console.log('PASS: Login successful with hashed password.');
        } else {
            console.error('FAIL: Login failed:', loginRes);
        }

    } catch (e) {
        console.error('Test Failed:', e);
    }
}

verify();
