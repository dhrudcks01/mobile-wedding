/* Test TypeScript handlers with the existing compiler; no production dependency. */
/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require("node:test");
const assert = require("node:assert/strict");
require("./register-typescript.cjs");
const policy = require("../src/lib/photos/upload-rules.ts");
const server = { ...require("../src/lib/photos/upload-security.ts"), ...require("../src/lib/photos/google-drive.ts") };
const sessionRoute = require("../src/app/api/photos/session/route.ts");
const chunkRoute = require("../src/app/api/photos/chunk/route.ts");
Object.assign(process.env, {
  UPLOAD_ENABLED: "true", UPLOAD_ORIGIN: "https://example.test", UPLOAD_EVENT_KEY: "test-event-key",
  UPLOAD_SESSION_SECRET: "test-session-secret-at-least-32-characters",
  UPLOAD_CLOSES_AT: "2099-01-01T00:00:00Z", GOOGLE_CLIENT_ID: "test-client", GOOGLE_CLIENT_SECRET: "test-secret",
  GOOGLE_REFRESH_TOKEN: "test-refresh", GOOGLE_DRIVE_FOLDER_ID: "test-folder",
});
const headers = { origin: process.env.UPLOAD_ORIGIN, "x-event-key": process.env.UPLOAD_EVENT_KEY };
const makeRequest = (body, extra = {}) => new Request("https://photos.example.test/api/photos/session", { method: "POST", headers: { ...headers, ...extra }, body });
test("format and size policy: empty, oversized, forged MIME and unsupported types rejected", () => {
  assert.equal(policy.validateFile("IMG.HEIC", 20, "").mime, "image/heic");
  assert.equal(policy.validateFile("clip.MOV", policy.MAX_FILE_BYTES, "video/quicktime").mime, "video/quicktime");
  for (const args of [["a.jpg", 0, "image/jpeg"], ["a.mp4", policy.MAX_FILE_BYTES + 1, "video/mp4"], ["a.jpg", 2, "text/html"], ["a.svg", 2, "image/svg+xml"]]) assert.throws(() => policy.validateFile(...args));
});
test("Drive ranges use confirmed bytes, including absent and malformed ranges", () => {
  assert.equal(policy.receivedOffset(null, 100), 0);
  assert.equal(policy.receivedOffset("bytes=0-42", 100), 43);
  assert.throws(() => policy.receivedOffset("bytes=0-200", 100));
  assert.throws(() => policy.receivedOffset("garbage", 100));
});
test("closed reception and wrong event/origin are rejected", () => {
  server.checkUploadRequest(makeRequest(""));
  assert.throws(() => server.checkUploadRequest(makeRequest("", { origin: "https://evil.test" })));
  assert.throws(() => server.checkUploadRequest(makeRequest("", { "x-event-key": "wrong" })));
  process.env.UPLOAD_ENABLED = "false";
  assert.equal(server.isUploadOpen(), false);
  assert.throws(() => server.checkUploadRequest(makeRequest("")));
  process.env.UPLOAD_ENABLED = "true";
});
test("encrypted sessions reject modification, expiration and arbitrary proxy targets", () => {
  const data = { url: "https://www.googleapis.com/upload/drive/v3/files?upload_id=test", size: 10, mime: "image/jpeg", id: "file-id", expires: Date.now() + 10000 };
  const sealed = server.encodeUploadSession(data);
  assert.deepEqual(server.decodeUploadSession(sealed), data);
  assert.equal(sealed.includes("googleapis"), false);
  const changed = Buffer.from(sealed, "base64url"); changed[30] ^= 1;
  assert.throws(() => server.decodeUploadSession(changed.toString("base64url")));
  assert.throws(() => server.decodeUploadSession(server.encodeUploadSession({ ...data, expires: 0 })));
  assert.throws(() => server.decodeUploadSession(server.encodeUploadSession({ ...data, url: "https://evil.test/upload" })));
});
test("request bodies are bounded even without content-length", async () => {
  await assert.rejects(() => server.readRequestBody(makeRequest("12345"), 4));
  assert.equal((await server.readRequestBody(makeRequest("1234"), 4)).length, 4);
});
test("invalid session metadata returns 400 without contacting Google", async () => {
  for (const body of ["null", "{", JSON.stringify({ name: "x.svg", size: 2, type: "image/svg+xml", guest: "" })]) {
    assert.equal((await sessionRoute.POST(makeRequest(body))).status, 400);
  }
});
test("mock Drive: resumable session, chunk range, final response loss and size mismatch", async () => {
  const originalFetch = global.fetch;
  let savedSize = 3;
  const calls = [];
  global.fetch = async (url, init) => {
    calls.push([String(url), init]);
    if (String(url).includes("oauth2")) return Response.json({ access_token: "test-access", expires_in: 3600 });
    if (String(url).includes("generateIds")) return Response.json({ ids: ["file-id"] });
    if (init.method === "POST") return new Response(null, { status: 200, headers: { location: "https://www.googleapis.com/upload/drive/v3/files?upload_id=test" } });
    if (String(url).includes("upload_id")) return new Response(null, { status: 404 });
    return Response.json({ id: "file-id", size: String(savedSize) });
  };
  try {
    const response = await sessionRoute.POST(makeRequest(JSON.stringify({ name: "a.jpg", size: 3, type: "image/jpeg", guest: "guest" })));
    assert.equal(response.status, 200);
    const { session } = await response.json();
    const data = server.decodeUploadSession(session);
    const create = calls.find(([url]) => url.includes("uploadType=resumable"));
    assert.deepEqual(JSON.parse(create[1].body).parents, ["test-folder"]);
    assert.deepEqual(await server.getUploadResult(new Response(null, { status: 308, headers: { range: "bytes=0-1" } }), data), { done: false, offset: 2 });
    const probe = await chunkRoute.POST(makeRequest("", { "x-upload-session": session }));
    assert.deepEqual(await probe.json(), { done: true, offset: 3 });
    const put = await chunkRoute.PUT(new Request("https://photos.example.test/api/photos/chunk", { method: "PUT", headers: { ...headers, "x-upload-session": session, "x-upload-offset": "0" }, body: "abc" }));
    assert.equal(put.status, 200);
    assert.ok(calls.some(([, init]) => new Headers(init.headers).get("Content-Range") === "bytes 0-2/3"));
    savedSize = 2;
    await assert.rejects(() => server.getUploadResult(new Response(null, { status: 200 }), data));
    const invalid = await chunkRoute.PUT(new Request("https://photos.example.test/api/photos/chunk", { method: "PUT", headers: { ...headers, "x-upload-session": session, "x-upload-offset": "3" }, body: "abc" }));
    assert.equal(invalid.status, 400);
  } finally { global.fetch = originalFetch; }
});

test("browser sends chunks in order to /api/photos and only finishes after server confirmation", async () => {
  const { createUploadSession, uploadFile } = require("../src/lib/photos/upload-client.ts");
  const originalFetch = global.fetch;
  const requests = [];
  const progress = [];
  const file = new File([new Uint8Array(policy.CHUNK_BYTES + 3)], "clip.mp4", { type: "video/mp4" });
  global.fetch = async (url, options) => {
    requests.push([url, options]);
    assert.equal(new Headers(options.headers).get("x-event-key"), "qr-key");
    if (url === "/api/photos/session") return Response.json({ session: "session-token" });
    assert.equal(url, "/api/photos/chunk");
    if (options.method === "POST") return Response.json({ done: false, offset: 0 });
    const offset = Number(new Headers(options.headers).get("x-upload-offset"));
    const next = offset + options.body.size;
    return Response.json({ done: next === file.size, offset: next });
  };
  try {
    const session = await createUploadSession(file, "guest", "qr-key");
    await uploadFile(file, session, "qr-key", (value) => progress.push(value));
    const chunks = requests.filter(([, options]) => options.method === "PUT");
    assert.deepEqual(chunks.map(([, options]) => options.body.size), [policy.CHUNK_BYTES, 3]);
    assert.deepEqual(chunks.map(([, options]) => new Headers(options.headers).get("x-upload-offset")), ["0", String(policy.CHUNK_BYTES)]);
    assert.equal(progress.at(-1), 100);
  } finally {
    global.fetch = originalFetch;
  }
});
