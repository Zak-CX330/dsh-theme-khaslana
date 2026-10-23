import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const templatePath = path.join(root, "lib", "client.template.js");
const outPath = path.join(root, "lib", "client.js");

const noArt = process.argv.includes("--no-art");
const lazy = process.argv.includes("--lazy");
const ART = {
  __ART_PHAINON__: "phainon.webp",
  __ART_SUN__: "sun.webp",
  __ART_REAVER__: "reaver.webp",
};

let out = fs.readFileSync(templatePath, "utf8");

for (const [token, file] of Object.entries(ART)) {
  if (!out.includes(token)) throw new Error(`template is missing ${token}`);
  let uri = "";
  if (!noArt && lazy) {
    // 立绘交给宿主路由按需取，客户端 bundle 回到 60KB 量级
    uri = `/khaslana/art/${file.replace(/\.webp$/, "")}`;
  } else if (!noArt) {
    const buf = fs.readFileSync(path.join(root, "assets", file));
    uri = `data:image/webp;base64,${buf.toString("base64")}`;
  }
  out = out.split(token).join(uri);
}

if (!out.includes("__VERSION__")) throw new Error("template is missing __VERSION__");
out = out.split("__VERSION__").join(pkg.version);

if (/__ART_|__VERSION__/.test(out)) throw new Error("unresolved placeholder left in output");

fs.writeFileSync(outPath, out);
const mode = noArt ? "no-art" : lazy ? "lazy" : "with-art";
console.log(
  `built ${path.relative(root, outPath)} · v${pkg.version} · ${mode} · ${(out.length / 1024).toFixed(0)} KB`,
);
