/**
 * Smoke test: verifies the Express app responds to all /api/* routes
 * without actually calling Gemini. Tests routing only.
 */
import { app } from '../app.ts';
import http from 'http';

const routes = [
  { method: 'POST', path: '/api/analyze/document', body: { base64Data: 'dGVzdA==', mimeType: 'image/png' } },
  { method: 'POST', path: '/api/analyze/media',    body: { base64Data: 'dGVzdA==', mimeType: 'image/png' } },
  { method: 'POST', path: '/api/analyze/voice',    body: { base64Data: 'dGVzdA==', mimeType: 'audio/wav' } },
  { method: 'POST', path: '/api/analyze/scam',     body: { text: 'test message' } },
  { method: 'POST', path: '/api/analyze/url',      body: { url: 'https://example.com' } },
  { method: 'GET',  path: '/api/health',            body: null },
];

async function testRoute(server, route) {
  const addr = server.address();
  const port = addr.port;
  const url = `http://localhost:${port}${route.path}`;

  const options = {
    method: route.method,
    headers: route.body ? { 'Content-Type': 'application/json' } : {},
  };

  return new Promise((resolve) => {
    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        // We only care that it's NOT 404. 
        // 400/500 are expected since GEMINI_API_KEY isn't set.
        const passed = res.statusCode !== 404;
        const icon = passed ? '✅' : '❌';
        console.log(`${icon} ${route.method} ${route.path} → ${res.statusCode} ${passed ? '(route found)' : '(404 NOT FOUND!)'}`);
        resolve(passed);
      });
    });
    req.on('error', (err) => {
      console.log(`❌ ${route.method} ${route.path} → ERROR: ${err.message}`);
      resolve(false);
    });
    if (route.body) req.write(JSON.stringify(route.body));
    req.end();
  });
}

const server = app.listen(0, async () => {
  console.log(`\n🔍 Testing Express route resolution on port ${server.address().port}...\n`);
  
  let allPassed = true;
  for (const route of routes) {
    const passed = await testRoute(server, route);
    if (!passed) allPassed = false;
  }
  
  console.log(`\n${allPassed ? '✅ All routes resolve (no 404s)' : '❌ Some routes returned 404!'}\n`);
  server.close();
  process.exit(allPassed ? 0 : 1);
});
