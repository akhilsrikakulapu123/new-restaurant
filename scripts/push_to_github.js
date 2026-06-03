const cp = require('child_process');
const fs = require('fs');

const token = process.argv[2];
const user = process.argv[3] || 'akhilsrikakulapu123';
const repo = process.argv[4] || 'madhuri-restaurant';
if (!token) { console.error('Missing token arg'); process.exit(1); }

try {
  const body = JSON.stringify({ name: repo, private: false });
  const curlCmd = `curl -s -H "Authorization: token ${token}" -H "User-Agent: setup-script" -d '${body.replace(/'/g, "\\'")}' https://api.github.com/user/repos`;
  const resp = cp.execSync(curlCmd, { encoding: 'utf8' });
  const json = JSON.parse(resp);
  const clone = json.clone_url || json.html_url || `https://github.com/${user}/${repo}`;
  console.log('REPO_CREATED:', clone);

  const cwd = 'C:/madhurirestaurant';
  if (!fs.existsSync(cwd)) { console.error('Project folder not found:', cwd); process.exit(1); }
  if (!fs.existsSync(cwd + '/.git')) cp.execSync('git init', { cwd, stdio: 'inherit' });
  if (!fs.existsSync(cwd + '/.gitignore')) fs.writeFileSync(cwd + '/.gitignore', 'node_modules\n.env\n.DS_Store\nbackend/node_modules\n');
  cp.execSync('git add .', { cwd, stdio: 'inherit' });
  try { cp.execSync('git commit -m "Initial commit"', { cwd, stdio: 'inherit' }); } catch(e) { /* ignore if no changes */ }
  cp.execSync('git branch -M main', { cwd, stdio: 'inherit' });
  cp.execSync('git remote remove origin || true', { cwd, stdio: 'inherit' });
  const pushUrl = `https://${token}@github.com/${user}/${repo}.git`;
  cp.execSync(`git remote add origin ${pushUrl}`, { cwd, stdio: 'inherit' });
  cp.execSync('git push -u origin main --force', { cwd, stdio: 'inherit' });
  console.log('PUSHED: https://github.com/' + user + '/' + repo);
} catch (err) {
  console.error('ERROR:', err.message);
  process.exit(1);
}
