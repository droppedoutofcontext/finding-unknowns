const http = require('http');
const fs = require('fs');
const yaml = require('js-yaml');
const { FileStore } = require('./lib/fileStore');

const settings = yaml.load(fs.readFileSync('config/settings.yaml', 'utf8'));
const sessions = new FileStore('data/sessions.json');

// middleware chain: each (req, res, next)
const chain = [logRequest, authenticate];

function logRequest(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

function authenticate(req, res, next) {
  req.clientId = req.headers['x-api-key'] || 'anonymous';
  next();
}

function runChain(req, res, i = 0) {
  if (i >= chain.length) return route(req, res);
  chain[i](req, res, () => runChain(req, res, i + 1));
}

function route(req, res) {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ ok: true, client: req.clientId }));
}

http.createServer((req, res) => runChain(req, res)).listen(settings.port);
console.log(`listening on :${settings.port}`);
