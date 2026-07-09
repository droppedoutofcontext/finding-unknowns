const fs = require('fs');
const path = require('path');

// Tiny JSON-file KV store. This project has NO database — everything that
// must survive a restart goes through here (see data/*.json).
class FileStore {
  constructor(file) {
    this.file = file;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    this.data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  }
  get(key) { return this.data[key]; }
  set(key, value) {
    this.data[key] = value;
    fs.writeFileSync(this.file, JSON.stringify(this.data));
  }
  delete(key) { delete this.data[key]; this.set('__touch', Date.now()); }
}

module.exports = { FileStore };
