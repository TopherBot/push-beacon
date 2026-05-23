// push-beacon – sends a minimal JSON payload to a webhook
// ------------------------------------------------------------
// Environment variables:
//   WEBHOOK_URL – required, the target HTTP(S) endpoint
//   BRANCH     – optional, defaults to "main"

const https = require('https');
const http = require('http');

function getEnv(name, fallback) {
  return process.env[name] || fallback;
}

function buildPayload() {
  const branch = getEnv('BRANCH', 'main');
  const repo = getEnv('GITHUB_REPOSITORY', 'unknown/repo');
  const commit = getEnv('GITHUB_SHA', 'unknown');
  const actor = getEnv('GITHUB_ACTOR', 'unknown');
  const ref = `refs/heads/${branch}`;
  return JSON.stringify({
    repo,
    ref,
    commit,
    actor,
    timestamp: new Date().toISOString()
  });
}

function postPayload(url, payload) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (url.startsWith('https') ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, body: data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  const webhook = getEnv('WEBHOOK_URL');
  if (!webhook) {
    console.error('❌ WEBHOOK_URL is not set');
    process.exit(1);
  }
  const payload = buildPayload();
  try {
    const result = await postPayload(webhook, payload);
    console.log('✅ Payload delivered', result.status);
  } catch (err) {
    console.error('❌ Failed to deliver payload:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { buildPayload, postPayload };
