const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 4173;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DATA_FILE = path.join(DATA_DIR, "cv-data.json");

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
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

function ensureDataFile() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "{}", "utf8");
  }
}

function readBody(request) {
  return new Promise(function (resolve, reject) {
    let body = "";

    request.on("data", function (chunk) {
      body += chunk;
    });

    request.on("end", function () {
      resolve(body);
    });

    request.on("error", reject);
  });
}

ensureDataFile();

http
  .createServer(async function (request, response) {
    const url = new URL(request.url || "/", "http://localhost");

    if (url.pathname === "/api/cv-data" && request.method === "GET") {
      fs.readFile(DATA_FILE, "utf8", function (error, content) {
        if (error) {
          response.writeHead(500, {
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify({ error: "read_failed" }));
          return;
        }

        response.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        });
        response.end(content);
      });
      return;
    }

    if (url.pathname === "/api/cv-data" && request.method === "POST") {
      try {
        const body = await readBody(request);
        const parsed = JSON.parse(body || "{}");

        fs.writeFile(
          DATA_FILE,
          JSON.stringify(parsed, null, 2),
          "utf8",
          function (error) {
            if (error) {
              response.writeHead(500, {
                "Content-Type": "application/json; charset=utf-8",
              });
              response.end(JSON.stringify({ error: "write_failed" }));
              return;
            }

            response.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "no-store",
            });
            response.end(JSON.stringify({ ok: true }));
          }
        );
      } catch (error) {
        response.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        response.end(JSON.stringify({ error: "invalid_payload" }));
      }
      return;
    }

    const file = resolveFile(url.pathname);

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
        "Content-Type":
          MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      });
      response.end(content);
    });
  })
  .listen(PORT, function () {
    console.log("CV App disponible en http://localhost:" + PORT);
  });
