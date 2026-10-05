const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const host = '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const root = __dirname;
const dataDirectory = path.join(root, 'data');
fs.mkdirSync(dataDirectory, { recursive: true });
const database = new DatabaseSync(path.join(dataDirectory, 'school-management.sqlite'));
const collections = new Set([
    'users', 'schoolName', 'schoolLogo', 'students', 'teachers', 'classes', 'timetable', 'attendance', 'fees', 'payments',
    'exams', 'results', 'inventory', 'notifications'
]);

database.exec(`
    CREATE TABLE IF NOT EXISTS app_data (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
`);

const readAll = database.prepare('SELECT key, value FROM app_data');
const writeOne = database.prepare(
    'INSERT INTO app_data (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
);

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(payload));
}

async function readRequestBody(request) {
    const chunks = [];
    let size = 0;

    for await (const chunk of request) {
        size += chunk.length;
        if (size > 5 * 1024 * 1024) {
            throw new Error('Request body is too large');
        }
        chunks.push(chunk);
    }

    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function serveFile(request, response) {
    const pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
    const requestedPath = pathname === '/' ? '/index.html' : pathname;
    const filePath = path.resolve(root, `.${requestedPath}`);

    if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        response.writeHead(404);
        response.end('Not found');
        return;
    }

    const contentTypes = {
        '.css': 'text/css; charset=utf-8',
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8'
    };
    response.writeHead(200, {
        'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream'
    });
    fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async(request, response) => {
    const pathname = new URL(request.url, `http://${host}:${port}`).pathname;

    if (pathname === '/api/data' && request.method === 'GET') {
        const data = Object.fromEntries(readAll.all().map(({ key, value }) => [key, JSON.parse(value)]));
        sendJson(response, 200, { data: Object.keys(data).length ? data : null });
        return;
    }

    if (pathname === '/api/data' && request.method === 'PUT') {
        try {
            const data = await readRequestBody(request);
            if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(key => !collections.has(key))) {
                sendJson(response, 400, { error: 'Invalid school data' });
                return;
            }

            database.exec('BEGIN');
            try {
                for (const [key, value] of Object.entries(data)) {
                    writeOne.run(key, JSON.stringify(value));
                }
                database.exec('COMMIT');
            } catch (error) {
                database.exec('ROLLBACK');
                throw error;
            }

            sendJson(response, 200, { ok: true });
        } catch (error) {
            sendJson(response, error.message === 'Request body is too large' ? 413 : 400, {
                error: error.message
            });
        }
        return;
    }

    if (pathname.startsWith('/api/')) {
        sendJson(response, 404, { error: 'Not found' });
        return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405);
        response.end('Method not allowed');
        return;
    }

    serveFile(request, response);
});

server.listen(port, host, () => {
    console.log(`School Management is available at http://${host}:${port}`);
    console.log(`SQLite database: ${path.join(dataDirectory, 'school-management.sqlite')}`);
});