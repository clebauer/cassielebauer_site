// Dev-only: lets the /admin/everything page save changes to everything.json.
// `apply: "serve"` means this only exists while `npm run dev` is running.
// It is never part of the production build, so nothing editable ships to Vercel.

import fs from "node:fs";
import path from "node:path";

// If your source folder isn't "src", change this path.
const FILE = path.resolve("src/features/everything/data/everything.json");

export default function everythingEditor() {
  return {
    name: "everything-editor",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__everything", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end("POST only");
        }
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            if (!Array.isArray(data.tags) || !Array.isArray(data.items)) {
              throw new Error("expected { tags: [], items: [] }");
            }
            // write to a temp file first so a crash can't leave a half-written file
            fs.writeFileSync(FILE + ".tmp", JSON.stringify(data, null, 2) + "\n");
            fs.renameSync(FILE + ".tmp", FILE);
            res.end("ok");
          } catch (err) {
            res.statusCode = 400;
            res.end(String(err.message));
          }
        });
      });
    },
  };
}