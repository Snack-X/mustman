module.exports = function(router) {

router.get("/", async ctx => {
  ctx.body = await ctx.readView("index.html");
});

router.get("/db/album_artists", async ctx => {
  const rows = await ctx.db.all("SELECT album_artist FROM files GROUP BY album_artist");
  ctx.body = rows.map(row => row.album_artist);
});

router.get("/db/albums", async ctx => {
  const { albumArtist } = ctx.query;

  if(typeof albumArtist === "undefined") {
    ctx.body = [];
    return;
  }

  const rows = await ctx.db.all("SELECT album FROM files WHERE album_artist = ? GROUP BY album", albumArtist);

  ctx.body = rows.map(row => row.album);
});

router.get("/db/tracks", async ctx => {
  const { albumArtist, album } = ctx.query;

  if(typeof albumArtist === "undefined" || typeof album === "undefined") {
    ctx.body = [];
    return;
  }

  const rows = await ctx.db.all("SELECT id, title, artist FROM files WHERE album_artist = ? AND album = ?", albumArtist, album);

  ctx.body = rows;
});

};