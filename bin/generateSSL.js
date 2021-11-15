require('dotenv').config();

const execSync = require('child_process').execSync;
execSync(`rm -f proxy/certs/* && mkcert -cert-file proxy/certs/ssl.crt -key-file proxy/certs/ssl.key "${process.env.NGINX_HOST} && openssl pkcs12 -export -out proxy/certs/ssl.p12 -inkey proxy/certs/ssl.key -in proxy/certs/ssl.crt"`);
