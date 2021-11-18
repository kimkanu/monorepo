require('dotenv').config();

const fs = require('fs');
const execSync = require('child_process').execSync;
execSync(`rm -f proxy/certs/*`);
fs.mkdirSync('proxy/certs', { recursive: true });
execSync(`mkcert -cert-file proxy/certs/ssl.crt -key-file proxy/certs/ssl.key "${process.env.NGINX_HOST}"`);
execSync(`openssl pkcs12 -export -out proxy/certs/ssl.p12 -inkey proxy/certs/ssl.key -in proxy/certs/ssl.crt`);
