const Split = require("split.js");
const T = require("./template");

const b64e = s => btoa(encodeURIComponent(s));
const b64d = s => decodeURIComponent(atob(s));

// Evil hacks
[ HTMLDocument, HTMLElement ].forEach(p => {
  p.prototype.$ = p.prototype.querySelector;
  p.prototype.$$ = p.prototype.querySelectorAll;
});

// Global variables
const LEFT = document.$(".pane-left");
const MIDDLE = document.$(".pane-middle");
const RIGHT = document.$(".pane-right");
let split;

function onLoad() {
  // Initialize split panes
  const third = 100 / 3;
  split = Split([".pane-left", ".pane-middle", ".pane-right"], {
    sizes: [ third, third, third ],
    minSize: 150,
  });

  // Load album artists by default
  loadAlbumArtists();
}

function loadAlbumArtists() {
  let url = "/db/album_artists";
  fetch(url).then(res => res.json())
    .then(json => {
      const items = json.map(a => ({ id: b64e(a), name: a }));

      LEFT.innerHTML = T("list-view")({
        title: "Album Artists",
        filterId: "filter-albumArtist",
        items: items
      });
      MIDDLE.innerHTML = "";
      RIGHT.innerHTML = "";

      LEFT.$$(".item").forEach(el => el.addEventListener("click", e => {
        let target = e.target;
        let id = target.getAttribute("data-id");
        id = b64d(id);

        if(LEFT.$(".selected"))
          LEFT.$(".selected").classList.remove("selected");
        target.classList.add("selected");

        loadAlbums(id);
      }));
    });
}

function loadAlbums(albumArtist) {
  let url = "/db/albums?albumArtist=" + encodeURIComponent(albumArtist)
  fetch(url).then(res => res.json())
    .then(json => {
      const items = json.map(a => ({ id: b64e(a), name: a }));

      MIDDLE.innerHTML = T("list-view")({
        title: "Albums by '" + albumArtist + "'",
        filterId: "filter-album",
        items: items
      });
      RIGHT.innerHTML = "";

      MIDDLE.$$(".item").forEach(el => el.addEventListener("click", e => {
        let target = e.target;
        let id = target.getAttribute("data-id");
        id = b64d(id);

        if(MIDDLE.$(".selected"))
          MIDDLE.$(".selected").classList.remove("selected");
        target.classList.add("selected");

        let albumArtist = b64d(LEFT.$(".selected").getAttribute("data-id"));
        loadTracks(albumArtist, id);
      }));
    });
}

function loadTracks(albumArtist, album) {
  let url = "/db/tracks?albumArtist=" + encodeURIComponent(albumArtist);
  url += "&album=" + encodeURIComponent(album);

  fetch(url).then(res => res.json())
    .then(json => {
      RIGHT.innerHTML = T("list-view-track")({
        title: album,
        items: json
      });
    });
}

window.addEventListener("load", onLoad);
