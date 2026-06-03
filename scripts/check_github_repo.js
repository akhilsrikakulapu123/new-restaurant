const https = require('https');
const token = process.argv[2];
if (!token) {
  console.error('Usage: node check_github_repo.js <token>');
  process.exit(1);
}
function get(path) {
  return new Promise((resolve, reject) => {
    https.get({ hostname: 'api.github.com', path, headers: { 'User-Agent': 'node', Authorization: `token ${token}` } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) return resolve(JSON.parse(data));
        return reject({ status: res.statusCode, body: data });
      });
    }).on('error', reject);
  });
}
(async () => {
  try {
    const user = await get('/user');
    console.log('USER', user.login);
    try {
      const repo = await get('/repos/akhilsrikakulapu123/madhuri-restaurant');
      console.log('REPO', repo.full_name, 'EXISTS');
    } catch (e) {
      console.log('REPO_STATUS', e.status);
      console.log('REPO_BODY', e.body.slice(0,200));
    }
  } catch (e) {
    console.error('FAIL', e.status || e);
  }
})();
