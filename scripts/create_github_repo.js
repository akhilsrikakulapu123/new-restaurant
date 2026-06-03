const https = require('https');
const token = process.argv[2];
const owner = process.argv[3] || 'akhilsrikakulapu123';
const repo = process.argv[4] || 'madhuri-restaurant';
if (!token) { console.error('Usage: node create_github_repo.js <token> [owner] [repo]'); process.exit(1); }
const body = JSON.stringify({ name: repo, private: false, description: 'Madhuri Restaurant website backend + frontend project' });
const options = {
  hostname: 'api.github.com',
  path: '/user/repos',
  method: 'POST',
  headers: {
    'User-Agent': 'node',
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
};
const req = https.request(options, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const json = JSON.parse(data);
      console.log('REPO_CREATED', json.html_url);
    } else {
      console.error('REPO_CREATE_FAILED', res.statusCode, data);
    }
  });
});
req.on('error', e => {
  console.error('ERROR', e.message);
});
req.write(body);
req.end();
