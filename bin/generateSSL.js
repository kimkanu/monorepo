require('dotenv').config({ path: '.env.ssl' });

const fs = require('fs');
const execSync = require('child_process').execSync;
execSync(`rm -f proxy/certs/*`);
fs.mkdirSync('proxy/certs', { recursive: true });
execSync(`mkcert -cert-file proxy/certs/ssl.crt -key-file proxy/certs/ssl.key "${process.env.NGINX_HOST}"`);