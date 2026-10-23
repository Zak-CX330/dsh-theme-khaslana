/**
 * dsh-theme-khaslana —— 宿主端。
 *
 * 只做一件事：人格设定。
 *   - 把用户写的人格底稿注册成 systemPrompt.section；
 *   - 提供 /khaslana/persona 的 GET/POST，供设置面板读写；
 *   - 存在 $DSH_HOME/khaslana-persona.json，保存后立刻对下一轮对话生效。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ID = "dsh-theme-khaslana";
const SECTION_NAME = "khaslana:persona";
const ROUTE_PREFIX = "/khaslana";
const MAX_BODY = 64 * 1024;

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const inject = ["systemPrompt", "webServer"];

// 随包的核心人格底稿（白厄-人格档案 §10）
function defaultPersona() {
  try {
    return fs.readFileSync(path.join(HERE, "persona.md"), "utf8").trim();
  } catch {
    return "";
  }
}

const DEFAULT_PERSONA = defaultPersona();


function stateFile() {
  const home = process.env.DSH_HOME ?? path.join(os.homedir(), ".dsh");
  return path.join(home, "khaslana-persona.json");
}

function readPersona() {
  try {
    const parsed = JSON.parse(fs.readFileSync(stateFile(), "utf8"));
    return typeof parsed.persona === "string" ? parsed.persona : "";
  } catch {
    return "";
  }
}

function writePersona(text) {
  const file = stateFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ persona: text }, null, 2), "utf8");
}

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export function apply(ctx) {
  let disposeSection = null;
  const stored = readPersona();
  let current = stored.trim() === "" ? DEFAULT_PERSONA : stored;

  const remount = () => {
    if (disposeSection !== null) {
      try {
        disposeSection();
      } catch {
        /* 交给 fiber 回收 */
      }
      disposeSection = null;
    }
    if (current.trim() === "" || ctx.systemPrompt === undefined) return;
    try {
      disposeSection = ctx.systemPrompt.section({
        name: SECTION_NAME,
        order: 100,
        text: current,
      });
    } catch (error) {
      console.warn(`${PACKAGE_ID}: persona section unavailable`, error);
      disposeSection = null;
    }
  };

  ctx.effect(() => {
    remount();
    return () => {
      if (disposeSection !== null) {
        try {
          disposeSection();
        } catch {
          /* ignore */
        }
        disposeSection = null;
      }
    };
  }, `${PACKAGE_ID}: persona section`);

  try {
    ctx.effect(
      () =>
        ctx.webServer.register({
          kind: "prefix",
          path: ROUTE_PREFIX,
          handler: async (req, res) => {
            const url = new URL(req.url ?? "/", "http://localhost");
            const route = url.pathname.slice(ROUTE_PREFIX.length) || "/";
            if (route.startsWith("/art/")) {
              const name = route.slice("/art/".length);
              if (!/^(phainon|sun|reaver)$/.test(name)) {
                sendJson(res, 404, { ok: false, error: "bad-art" });
                return;
              }
              fs.readFile(path.join(HERE, "..", "assets", `${name}.webp`), (error, buffer) => {
                if (error) {
                  sendJson(res, 404, { ok: false, error: "no-art" });
                  return;
                }
                res.writeHead(200, {
                  "content-type": "image/webp",
                  "content-length": buffer.length,
                  "cache-control": "public, max-age=31536000, immutable",
                });
                res.end(buffer);
              });
              return;
            }
            if (route !== "/persona") {
              sendJson(res, 404, { ok: false, error: "not-found" });
              return;
            }
            if (req.method === "GET") {
              sendJson(res, 200, { ok: true, persona: current });
              return;
            }
            if (req.method === "POST") {
              try {
                const body = JSON.parse((await readBody(req)) || "{}");
                if (typeof body.persona !== "string") {
                  sendJson(res, 400, { ok: false, error: "bad-persona" });
                  return;
                }
                const raw = body.persona;
                // 留空 = 恢复随包的核心人格底稿
                current = raw.trim() === "" ? DEFAULT_PERSONA : raw.slice(0, 12000);
                writePersona(raw.trim() === "" ? "" : current);
                remount();
                sendJson(res, 200, { ok: true, persona: current });
              } catch {
                sendJson(res, 400, { ok: false, error: "bad-request" });
              }
              return;
            }
            sendJson(res, 405, { ok: false, error: "method" });
          },
        }),
      `${PACKAGE_ID}: persona route`,
    );
  } catch (error) {
    // 没有 webServer 服务时（极老的宿主）只是失去面板保存能力，不影响主题本身
    console.warn(`${PACKAGE_ID}: persona route unavailable`, error);
  }
}
