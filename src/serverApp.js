const fs = require("mz/fs");
const path = require("path");

const koa = require("koa");
const koaRouter = require("koa-router");
const koaStatic = require("koa-static");
const koaMount = require("koa-mount");

const PATH_BASE = path.join(__dirname, "../");
const PATH_VIEW = PATH_BASE + "/views";
const PATH_STATIC = PATH_BASE + "/static";
const HTTP_PORT = parseInt(process.env.HTTP_PORT) || 80;

const app = new koa();
app.proxy = true;

app.use(async (ctx, next) => {
  try {
    await next();
  } catch(e) {
    ctx.status = 500;
    ctx.body = e.stack || e.toString();
  }
});


app.use(koaMount("/static", koaStatic(PATH_STATIC)));

const router = koaRouter();
// ROUTE DEFINITION START

router.get("/", async ctx => {
  ctx.body = await fs.readFile(PATH_VIEW + "/index.html", { encoding: "utf8" });
});

// ROUTE DEFINITION END
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(HTTP_PORT);
