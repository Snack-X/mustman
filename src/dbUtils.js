const Loki = require("lokijs");
// const LokiFSA = require("lokijs/src/loki-fs-structured-adapter");

module.exports.load = async function() { return new Promise((resolve, reject) => {
  // const adapter = new LokiFSA();
  const db = new Loki("music.db", {
    // adapter: adapter,
    autoload: true,
    autoloadCallback: () => { resolve(db); },
  });
}); };

module.exports.save = async function(db) { return new Promise((resolve, reject) => {
  db.save(resolve);
}); };

module.exports.getCollection = function(db, collection) {
  const col = db.getCollection(collection);
  if(col) return col;

  db.addCollection(collection);
  return db.getCollection(collection);
};
