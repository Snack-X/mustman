-- Up

CREATE TABLE files (
  id TEXT UNIQUE NOT NULL,
  filepath TEXT UNIQUE NOT NULL,
  title TEXT DEFAULT "",
  album TEXT DEFAULT "",
  artist TEXT DEFAULT "",
  album_artist TEXT DEFAULT "",
  PRIMARY KEY (`id`)
);

CREATE TABLE entries (
  path TEXT UNIQUE NOT NULL,
  PRIMARY KEY (`path`)
);

-- Down

DROP TABLE files;
DROP TABLE entries;
