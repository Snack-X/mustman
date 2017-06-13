const crypto = require("crypto");
const fs = require("mz/fs");
const path = require("path");
const { exec } = require("mz/child_process");

const db = require("sqlite");

async function readdirRecursive(baseEntry, filter) {
  const stat = await fs.stat(baseEntry);

  if(stat.isFile()) {
    if(!(filter instanceof RegExp) || filter.test(baseEntry)) return [ baseEntry ];
    else return [];
  }
  else if(!stat.isDirectory()) return [];

  let entries = [];
  let subEntries = await fs.readdir(baseEntry);
  subEntries = subEntries.map(e => path.join(baseEntry, e));

  for(let entry of subEntries) {
    let recursed = await readdirRecursive(entry, filter);

    for(let e of recursed) entries.push(e);
  }

  return entries;
}

const shellEscape = str => {
  str = str.replace(/\\/g, "\\\\");
  str = str.replace(/'/g, "'\\''");
  return `'${str}'`;
};

module.exports = {
  async Probe(filename) {
    const output = await exec(`ffprobe -v quiet -of json -show_format -show_streams ${shellEscape(filename)}`);
    const result = JSON.parse(output[0]);
    return result;
  },

  readdirRecursive,

  async sqliteOpen(filename) {
    await db.open(filename, { Promise });
    await db.migrate({ migrationsPath: path.join(__dirname, "migrations") });
    return db;
  },

  sha256(str) {
    const sha256 = crypto.createHash("sha256");
    sha256.update(str);
    return sha256.digest("hex");
  },

  shellEscape,
};
