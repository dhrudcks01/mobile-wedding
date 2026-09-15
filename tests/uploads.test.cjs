/* Test TypeScript handlers with the existing compiler; no production dependency. */
/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require("node:test");
const assert = require("node:assert/strict");
require("./register-typescript.cjs");
const policy = require("../src/lib/photos/upload-rules.ts");
const server = { ...require("../src/lib/photos/upload-security.ts"), ...require("../src/lib/photos/google-drive.ts") };
const { uploadConfig } = require("../src/lib/photos/upload-config.ts");
const sessionRoute = require("../src/app/api/photos/session/route.ts");
const chunkRoute = require("../src/app/api/photos/chunk/route.ts");
Object.assign(process.env, {
  GOOGLE_CLIENT_ID: "test-client", GOOGLE_CLIENT_SECRET: "test-secret",
  GOOGLE_REFRESH_TOKEN: "test-refresh", GOOGLE_DRIVE_FOLDER_ID: "test-folder",
});
const headers = { origin: "https://ournewday.kr" };
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
test("only four Google settings are required; closed reception and wrong origins are rejected", () => {
  server.checkUploadRequest(makeRequest(""));
  assert.throws(() => server.checkUploadRequest(makeRequest("", { origin: "https://evil.test" })));
  uploadConfig.enabled = false;
  assert.equal(server.isUploadOpen(), false);
  assert.throws(() => server.checkUploadRequest(makeRequest("")));
  uploadConfig.enabled = true;
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
    if (new URL(url).searchParams.has("q")) return Response.json({ files: [{ id: "guest-folder" }] });
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
    assert.deepEqual(JSON.parse(create[1].body).parents, ["guest-folder"]);
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
    assert.equal(new Headers(options.headers).has("x-event-key"), false);
    if (url === "/api/photos/session") return Response.json({ session: "session-token" });
    assert.equal(url, "/api/photos/chunk");
    if (options.method === "POST") return Response.json({ done: false, offset: 0 });
    const offset = Number(new Headers(options.headers).get("x-upload-offset"));
    const next = offset + options.body.size;
    return Response.json({ done: next === file.size, offset: next });
  };
  try {
    const session = await createUploadSession(file, "guest");
    await uploadFile(file, session, (value) => progress.push(value));
    const chunks = requests.filter(([, options]) => options.method === "PUT");
    assert.deepEqual(chunks.map(([, options]) => options.body.size), [policy.CHUNK_BYTES, 3]);
    assert.deepEqual(chunks.map(([, options]) => new Headers(options.headers).get("x-upload-offset")), ["0", String(policy.CHUNK_BYTES)]);
    assert.equal(progress.at(-1), 100);
  } finally {
    global.fetch = originalFetch;
  }
});

test("missing Google configuration and an expired reception are rejected", () => {
  const end = uploadConfig.closesAt;
  try {
    uploadConfig.closesAt = "2000-01-01T00:00:00Z";
    assert.equal(server.isUploadOpen(), false);
    uploadConfig.closesAt = end;
    for (const name of ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "GOOGLE_DRIVE_FOLDER_ID"]) {
      const value = process.env[name];
      try {
        delete process.env[name];
        assert.equal(server.isUploadOpen(), false);
      } finally { process.env[name] = value; }
    }
  } finally { uploadConfig.closesAt = end; }
});

test("changing the Google secret invalidates an existing upload session", () => {
  const value = process.env.GOOGLE_CLIENT_SECRET;
  const token = server.encodeUploadSession({ url: "https://www.googleapis.com/upload/drive/v3/files?upload_id=test", size: 3, mime: "image/jpeg", id: "file-id", expires: Date.now() + 60000 });
  try {
    process.env.GOOGLE_CLIENT_SECRET = "different-google-secret";
    assert.throws(() => server.decodeUploadSession(token));
  } finally { process.env.GOOGLE_CLIENT_SECRET = value; }
});

test("guest folder names normalize whitespace and empty names use anonymous", () => {
  assert.equal(server.guestFolderName("  홍길동  "), "홍길동");
  assert.equal(server.guestFolderName("홍  길동"), "홍 길동");
  assert.equal(server.guestFolderName("   "), "익명");
});

test("guest folders are searched within the configured parent, reused, and created once for concurrent requests", async () => {
  const originalFetch = global.fetch;
  let folder;
  let creates = 0;
  const queries = [];
  global.fetch = async (url, options) => {
    const address = new URL(url);
    if (address.searchParams.has("q")) {
      queries.push(address.searchParams.get("q"));
      return Response.json({ files: folder ? [{ id: folder.id }] : [] });
    }
    assert.equal(options.method, "POST");
    const body = JSON.parse(options.body);
    assert.deepEqual(body.parents, ["test-folder"]);
    assert.equal(body.mimeType, "application/vnd.google-apps.folder");
    folder = { ...body, id: "new-guest-folder" };
    creates++;
    return Response.json({ id: folder.id });
  };
  try {
    const ids = await Promise.all([server.getGuestFolder(" 홍길동 "), server.getGuestFolder("홍길동")]);
    assert.deepEqual(ids, ["new-guest-folder", "new-guest-folder"]);
    assert.equal(creates, 1);
    assert.equal(folder.name, "홍길동");
    assert.equal(await server.getGuestFolder("홍길동"), "new-guest-folder");
    assert.equal(creates, 1);
    assert.ok(queries.every(q => q.includes("'test-folder' in parents") && q.includes("trashed = false")));
  } finally { global.fetch = originalFetch; }
});

test("folder lookup failure never creates another folder or falls back to the root", async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => { calls++; return new Response(null, { status: 403 }); };
  try {
    await assert.rejects(() => server.getGuestFolder("실패 테스트"));
    assert.equal(calls, 1);
  } finally { global.fetch = originalFetch; }
});
