const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 4173;
const ROOT = __dirname;
const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function resolveFile(urlPath) {
  let clean = urlPath === "/" ? "/index.html" : urlPath;

  if (clean === "/admin") {
    clean = "/admin.html";
  }

  if (clean === "/public") {
    clean = "/index.html";
  }

  const file = path.normalize(path.join(ROOT, clean));
  return file.startsWith(ROOT) ? file : null;
}

http
  .createServer(function (request, response) {
    const file = resolveFile(request.url || "/");

    if (!file) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(file, function (error, content) {
      if (error) {
        response.writeHead(error.code === "ENOENT" ? 404 : 500);
        response.end(error.code === "ENOENT" ? "Not found" : "Server error");
        return;
      }

      response.writeHead(200, {
        "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      });
      response.end(content);
    });
  })
  .listen(PORT, function () {
    console.log("CV App disponible en http://localhost:" + PORT);
  });
